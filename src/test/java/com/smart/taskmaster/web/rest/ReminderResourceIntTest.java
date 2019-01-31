package com.smart.taskmaster.web.rest;

import com.smart.taskmaster.TaskMasterApp;

import com.smart.taskmaster.domain.Reminder;
import com.smart.taskmaster.repository.ReminderRepository;
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
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;


import static com.smart.taskmaster.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ReminderResource REST controller.
 *
 * @see ReminderResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = TaskMasterApp.class)
public class ReminderResourceIntTest {

    private static final Instant DEFAULT_REMINDER_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_REMINDER_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restReminderMockMvc;

    private Reminder reminder;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ReminderResource reminderResource = new ReminderResource(reminderRepository);
        this.restReminderMockMvc = MockMvcBuilders.standaloneSetup(reminderResource)
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
    public static Reminder createEntity(EntityManager em) {
        Reminder reminder = new Reminder()
            .reminderDate(DEFAULT_REMINDER_DATE);
        return reminder;
    }

    @Before
    public void initTest() {
        reminder = createEntity(em);
    }

    @Test
    @Transactional
    public void createReminder() throws Exception {
        int databaseSizeBeforeCreate = reminderRepository.findAll().size();

        // Create the Reminder
        restReminderMockMvc.perform(post("/api/reminders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reminder)))
            .andExpect(status().isCreated());

        // Validate the Reminder in the database
        List<Reminder> reminderList = reminderRepository.findAll();
        assertThat(reminderList).hasSize(databaseSizeBeforeCreate + 1);
        Reminder testReminder = reminderList.get(reminderList.size() - 1);
        assertThat(testReminder.getReminderDate()).isEqualTo(DEFAULT_REMINDER_DATE);
    }

    @Test
    @Transactional
    public void createReminderWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = reminderRepository.findAll().size();

        // Create the Reminder with an existing ID
        reminder.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restReminderMockMvc.perform(post("/api/reminders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reminder)))
            .andExpect(status().isBadRequest());

        // Validate the Reminder in the database
        List<Reminder> reminderList = reminderRepository.findAll();
        assertThat(reminderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllReminders() throws Exception {
        // Initialize the database
        reminderRepository.saveAndFlush(reminder);

        // Get all the reminderList
        restReminderMockMvc.perform(get("/api/reminders?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reminder.getId().intValue())))
            .andExpect(jsonPath("$.[*].reminderDate").value(hasItem(DEFAULT_REMINDER_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getReminder() throws Exception {
        // Initialize the database
        reminderRepository.saveAndFlush(reminder);

        // Get the reminder
        restReminderMockMvc.perform(get("/api/reminders/{id}", reminder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(reminder.getId().intValue()))
            .andExpect(jsonPath("$.reminderDate").value(DEFAULT_REMINDER_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingReminder() throws Exception {
        // Get the reminder
        restReminderMockMvc.perform(get("/api/reminders/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateReminder() throws Exception {
        // Initialize the database
        reminderRepository.saveAndFlush(reminder);

        int databaseSizeBeforeUpdate = reminderRepository.findAll().size();

        // Update the reminder
        Reminder updatedReminder = reminderRepository.findById(reminder.getId()).get();
        // Disconnect from session so that the updates on updatedReminder are not directly saved in db
        em.detach(updatedReminder);
        updatedReminder
            .reminderDate(UPDATED_REMINDER_DATE);

        restReminderMockMvc.perform(put("/api/reminders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedReminder)))
            .andExpect(status().isOk());

        // Validate the Reminder in the database
        List<Reminder> reminderList = reminderRepository.findAll();
        assertThat(reminderList).hasSize(databaseSizeBeforeUpdate);
        Reminder testReminder = reminderList.get(reminderList.size() - 1);
        assertThat(testReminder.getReminderDate()).isEqualTo(UPDATED_REMINDER_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingReminder() throws Exception {
        int databaseSizeBeforeUpdate = reminderRepository.findAll().size();

        // Create the Reminder

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReminderMockMvc.perform(put("/api/reminders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(reminder)))
            .andExpect(status().isBadRequest());

        // Validate the Reminder in the database
        List<Reminder> reminderList = reminderRepository.findAll();
        assertThat(reminderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteReminder() throws Exception {
        // Initialize the database
        reminderRepository.saveAndFlush(reminder);

        int databaseSizeBeforeDelete = reminderRepository.findAll().size();

        // Get the reminder
        restReminderMockMvc.perform(delete("/api/reminders/{id}", reminder.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Reminder> reminderList = reminderRepository.findAll();
        assertThat(reminderList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Reminder.class);
        Reminder reminder1 = new Reminder();
        reminder1.setId(1L);
        Reminder reminder2 = new Reminder();
        reminder2.setId(reminder1.getId());
        assertThat(reminder1).isEqualTo(reminder2);
        reminder2.setId(2L);
        assertThat(reminder1).isNotEqualTo(reminder2);
        reminder1.setId(null);
        assertThat(reminder1).isNotEqualTo(reminder2);
    }
}
