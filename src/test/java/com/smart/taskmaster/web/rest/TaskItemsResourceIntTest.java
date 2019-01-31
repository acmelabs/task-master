package com.smart.taskmaster.web.rest;

import com.smart.taskmaster.TaskMasterApp;

import com.smart.taskmaster.domain.TaskItems;
import com.smart.taskmaster.repository.TaskItemsRepository;
import com.smart.taskmaster.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;


import static com.smart.taskmaster.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the TaskItemsResource REST controller.
 *
 * @see TaskItemsResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TaskMasterApp.class)
public class TaskItemsResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private TaskItemsRepository taskItemsRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restTaskItemsMockMvc;

    private TaskItems taskItems;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TaskItemsResource taskItemsResource = new TaskItemsResource(taskItemsRepository);
        this.restTaskItemsMockMvc = MockMvcBuilders.standaloneSetup(taskItemsResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TaskItems createEntity(EntityManager em) {
        TaskItems taskItems = new TaskItems()
            .name(DEFAULT_NAME);
        return taskItems;
    }

    @Before
    public void initTest() {
        taskItems = createEntity(em);
    }

    @Test
    @Transactional
    public void createTaskItems() throws Exception {
        int databaseSizeBeforeCreate = taskItemsRepository.findAll().size();

        // Create the TaskItems
        restTaskItemsMockMvc.perform(post("/api/task-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(taskItems)))
            .andExpect(status().isCreated());

        // Validate the TaskItems in the database
        List<TaskItems> taskItemsList = taskItemsRepository.findAll();
        assertThat(taskItemsList).hasSize(databaseSizeBeforeCreate + 1);
        TaskItems testTaskItems = taskItemsList.get(taskItemsList.size() - 1);
        assertThat(testTaskItems.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createTaskItemsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = taskItemsRepository.findAll().size();

        // Create the TaskItems with an existing ID
        taskItems.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTaskItemsMockMvc.perform(post("/api/task-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(taskItems)))
            .andExpect(status().isBadRequest());

        // Validate the TaskItems in the database
        List<TaskItems> taskItemsList = taskItemsRepository.findAll();
        assertThat(taskItemsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllTaskItems() throws Exception {
        // Initialize the database
        taskItemsRepository.saveAndFlush(taskItems);

        // Get all the taskItemsList
        restTaskItemsMockMvc.perform(get("/api/task-items?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(taskItems.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getTaskItems() throws Exception {
        // Initialize the database
        taskItemsRepository.saveAndFlush(taskItems);

        // Get the taskItems
        restTaskItemsMockMvc.perform(get("/api/task-items/{id}", taskItems.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(taskItems.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingTaskItems() throws Exception {
        // Get the taskItems
        restTaskItemsMockMvc.perform(get("/api/task-items/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTaskItems() throws Exception {
        // Initialize the database
        taskItemsRepository.saveAndFlush(taskItems);

        int databaseSizeBeforeUpdate = taskItemsRepository.findAll().size();

        // Update the taskItems
        TaskItems updatedTaskItems = taskItemsRepository.findById(taskItems.getId()).get();
        // Disconnect from session so that the updates on updatedTaskItems are not directly saved in db
        em.detach(updatedTaskItems);
        updatedTaskItems
            .name(UPDATED_NAME);

        restTaskItemsMockMvc.perform(put("/api/task-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTaskItems)))
            .andExpect(status().isOk());

        // Validate the TaskItems in the database
        List<TaskItems> taskItemsList = taskItemsRepository.findAll();
        assertThat(taskItemsList).hasSize(databaseSizeBeforeUpdate);
        TaskItems testTaskItems = taskItemsList.get(taskItemsList.size() - 1);
        assertThat(testTaskItems.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingTaskItems() throws Exception {
        int databaseSizeBeforeUpdate = taskItemsRepository.findAll().size();

        // Create the TaskItems

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTaskItemsMockMvc.perform(put("/api/task-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(taskItems)))
            .andExpect(status().isBadRequest());

        // Validate the TaskItems in the database
        List<TaskItems> taskItemsList = taskItemsRepository.findAll();
        assertThat(taskItemsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTaskItems() throws Exception {
        // Initialize the database
        taskItemsRepository.saveAndFlush(taskItems);

        int databaseSizeBeforeDelete = taskItemsRepository.findAll().size();

        // Get the taskItems
        restTaskItemsMockMvc.perform(delete("/api/task-items/{id}", taskItems.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<TaskItems> taskItemsList = taskItemsRepository.findAll();
        assertThat(taskItemsList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TaskItems.class);
        TaskItems taskItems1 = new TaskItems();
        taskItems1.setId(1L);
        TaskItems taskItems2 = new TaskItems();
        taskItems2.setId(taskItems1.getId());
        assertThat(taskItems1).isEqualTo(taskItems2);
        taskItems2.setId(2L);
        assertThat(taskItems1).isNotEqualTo(taskItems2);
        taskItems1.setId(null);
        assertThat(taskItems1).isNotEqualTo(taskItems2);
    }
}
