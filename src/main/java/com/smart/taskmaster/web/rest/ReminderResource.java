package com.smart.taskmaster.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.smart.taskmaster.domain.Reminder;
import com.smart.taskmaster.repository.ReminderRepository;
import com.smart.taskmaster.web.rest.errors.BadRequestAlertException;
import com.smart.taskmaster.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Reminder.
 */
@RestController
@RequestMapping("/api")
public class ReminderResource {

    private final Logger log = LoggerFactory.getLogger(ReminderResource.class);

    private static final String ENTITY_NAME = "reminder";

    private final ReminderRepository reminderRepository;

    public ReminderResource(ReminderRepository reminderRepository) {
        this.reminderRepository = reminderRepository;
    }

    /**
     * POST  /reminders : Create a new reminder.
     *
     * @param reminder the reminder to create
     * @return the ResponseEntity with status 201 (Created) and with body the new reminder, or with status 400 (Bad Request) if the reminder has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/reminders")
    @Timed
    public ResponseEntity<Reminder> createReminder(@RequestBody Reminder reminder) throws URISyntaxException {
        log.debug("REST request to save Reminder : {}", reminder);
        if (reminder.getId() != null) {
            throw new BadRequestAlertException("A new reminder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Reminder result = reminderRepository.save(reminder);
        return ResponseEntity.created(new URI("/api/reminders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /reminders : Updates an existing reminder.
     *
     * @param reminder the reminder to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated reminder,
     * or with status 400 (Bad Request) if the reminder is not valid,
     * or with status 500 (Internal Server Error) if the reminder couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/reminders")
    @Timed
    public ResponseEntity<Reminder> updateReminder(@RequestBody Reminder reminder) throws URISyntaxException {
        log.debug("REST request to update Reminder : {}", reminder);
        if (reminder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Reminder result = reminderRepository.save(reminder);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, reminder.getId().toString()))
            .body(result);
    }

    /**
     * GET  /reminders : get all the reminders.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of reminders in body
     */
    @GetMapping("/reminders")
    @Timed
    public List<Reminder> getAllReminders() {
        log.debug("REST request to get all Reminders");
        return reminderRepository.findAll();
    }

    /**
     * GET  /reminders/:id : get the "id" reminder.
     *
     * @param id the id of the reminder to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the reminder, or with status 404 (Not Found)
     */
    @GetMapping("/reminders/{id}")
    @Timed
    public ResponseEntity<Reminder> getReminder(@PathVariable Long id) {
        log.debug("REST request to get Reminder : {}", id);
        Optional<Reminder> reminder = reminderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(reminder);
    }

    /**
     * DELETE  /reminders/:id : delete the "id" reminder.
     *
     * @param id the id of the reminder to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/reminders/{id}")
    @Timed
    public ResponseEntity<Void> deleteReminder(@PathVariable Long id) {
        log.debug("REST request to delete Reminder : {}", id);

        reminderRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
