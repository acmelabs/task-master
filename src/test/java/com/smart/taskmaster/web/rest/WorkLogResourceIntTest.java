package com.smart.taskmaster.web.rest;

import com.smart.taskmaster.TaskMasterApp;

import com.smart.taskmaster.domain.WorkLog;
import com.smart.taskmaster.repository.WorkLogRepository;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;


import static com.smart.taskmaster.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the WorkLogResource REST controller.
 *
 * @see WorkLogResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TaskMasterApp.class)
public class WorkLogResourceIntTest {

    private static final LocalDate DEFAULT_WORK_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_WORK_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    @Autowired
    private WorkLogRepository workLogRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restWorkLogMockMvc;

    private WorkLog workLog;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final WorkLogResource workLogResource = new WorkLogResource(workLogRepository);
        this.restWorkLogMockMvc = MockMvcBuilders.standaloneSetup(workLogResource)
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
    public static WorkLog createEntity(EntityManager em) {
        WorkLog workLog = new WorkLog()
            .workDate(DEFAULT_WORK_DATE)
            .quantity(DEFAULT_QUANTITY);
        return workLog;
    }

    @Before
    public void initTest() {
        workLog = createEntity(em);
    }

    @Test
    @Transactional
    public void createWorkLog() throws Exception {
        int databaseSizeBeforeCreate = workLogRepository.findAll().size();

        // Create the WorkLog
        restWorkLogMockMvc.perform(post("/api/work-logs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workLog)))
            .andExpect(status().isCreated());

        // Validate the WorkLog in the database
        List<WorkLog> workLogList = workLogRepository.findAll();
        assertThat(workLogList).hasSize(databaseSizeBeforeCreate + 1);
        WorkLog testWorkLog = workLogList.get(workLogList.size() - 1);
        assertThat(testWorkLog.getWorkDate()).isEqualTo(DEFAULT_WORK_DATE);
        assertThat(testWorkLog.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
    }

    @Test
    @Transactional
    public void createWorkLogWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = workLogRepository.findAll().size();

        // Create the WorkLog with an existing ID
        workLog.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restWorkLogMockMvc.perform(post("/api/work-logs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workLog)))
            .andExpect(status().isBadRequest());

        // Validate the WorkLog in the database
        List<WorkLog> workLogList = workLogRepository.findAll();
        assertThat(workLogList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllWorkLogs() throws Exception {
        // Initialize the database
        workLogRepository.saveAndFlush(workLog);

        // Get all the workLogList
        restWorkLogMockMvc.perform(get("/api/work-logs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(workLog.getId().intValue())))
            .andExpect(jsonPath("$.[*].workDate").value(hasItem(DEFAULT_WORK_DATE.toString())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)));
    }
    
    @Test
    @Transactional
    public void getWorkLog() throws Exception {
        // Initialize the database
        workLogRepository.saveAndFlush(workLog);

        // Get the workLog
        restWorkLogMockMvc.perform(get("/api/work-logs/{id}", workLog.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(workLog.getId().intValue()))
            .andExpect(jsonPath("$.workDate").value(DEFAULT_WORK_DATE.toString()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY));
    }

    @Test
    @Transactional
    public void getNonExistingWorkLog() throws Exception {
        // Get the workLog
        restWorkLogMockMvc.perform(get("/api/work-logs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateWorkLog() throws Exception {
        // Initialize the database
        workLogRepository.saveAndFlush(workLog);

        int databaseSizeBeforeUpdate = workLogRepository.findAll().size();

        // Update the workLog
        WorkLog updatedWorkLog = workLogRepository.findById(workLog.getId()).get();
        // Disconnect from session so that the updates on updatedWorkLog are not directly saved in db
        em.detach(updatedWorkLog);
        updatedWorkLog
            .workDate(UPDATED_WORK_DATE)
            .quantity(UPDATED_QUANTITY);

        restWorkLogMockMvc.perform(put("/api/work-logs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedWorkLog)))
            .andExpect(status().isOk());

        // Validate the WorkLog in the database
        List<WorkLog> workLogList = workLogRepository.findAll();
        assertThat(workLogList).hasSize(databaseSizeBeforeUpdate);
        WorkLog testWorkLog = workLogList.get(workLogList.size() - 1);
        assertThat(testWorkLog.getWorkDate()).isEqualTo(UPDATED_WORK_DATE);
        assertThat(testWorkLog.getQuantity()).isEqualTo(UPDATED_QUANTITY);
    }

    @Test
    @Transactional
    public void updateNonExistingWorkLog() throws Exception {
        int databaseSizeBeforeUpdate = workLogRepository.findAll().size();

        // Create the WorkLog

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorkLogMockMvc.perform(put("/api/work-logs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workLog)))
            .andExpect(status().isBadRequest());

        // Validate the WorkLog in the database
        List<WorkLog> workLogList = workLogRepository.findAll();
        assertThat(workLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteWorkLog() throws Exception {
        // Initialize the database
        workLogRepository.saveAndFlush(workLog);

        int databaseSizeBeforeDelete = workLogRepository.findAll().size();

        // Get the workLog
        restWorkLogMockMvc.perform(delete("/api/work-logs/{id}", workLog.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<WorkLog> workLogList = workLogRepository.findAll();
        assertThat(workLogList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WorkLog.class);
        WorkLog workLog1 = new WorkLog();
        workLog1.setId(1L);
        WorkLog workLog2 = new WorkLog();
        workLog2.setId(workLog1.getId());
        assertThat(workLog1).isEqualTo(workLog2);
        workLog2.setId(2L);
        assertThat(workLog1).isNotEqualTo(workLog2);
        workLog1.setId(null);
        assertThat(workLog1).isNotEqualTo(workLog2);
    }
}
