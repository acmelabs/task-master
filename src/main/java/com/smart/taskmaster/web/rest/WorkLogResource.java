package com.smart.taskmaster.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.smart.taskmaster.domain.WorkLog;
import com.smart.taskmaster.repository.WorkLogRepository;
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
 * REST controller for managing WorkLog.
 */
@RestController
@RequestMapping("/api")
public class WorkLogResource {

    private final Logger log = LoggerFactory.getLogger(WorkLogResource.class);

    private static final String ENTITY_NAME = "workLog";

    private final WorkLogRepository workLogRepository;

    public WorkLogResource(WorkLogRepository workLogRepository) {
        this.workLogRepository = workLogRepository;
    }

    /**
     * POST  /work-logs : Create a new workLog.
     *
     * @param workLog the workLog to create
     * @return the ResponseEntity with status 201 (Created) and with body the new workLog, or with status 400 (Bad Request) if the workLog has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/work-logs")
    @Timed
    public ResponseEntity<WorkLog> createWorkLog(@RequestBody WorkLog workLog) throws URISyntaxException {
        log.debug("REST request to save WorkLog : {}", workLog);
        if (workLog.getId() != null) {
            throw new BadRequestAlertException("A new workLog cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WorkLog result = workLogRepository.save(workLog);
        return ResponseEntity.created(new URI("/api/work-logs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /work-logs : Updates an existing workLog.
     *
     * @param workLog the workLog to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated workLog,
     * or with status 400 (Bad Request) if the workLog is not valid,
     * or with status 500 (Internal Server Error) if the workLog couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/work-logs")
    @Timed
    public ResponseEntity<WorkLog> updateWorkLog(@RequestBody WorkLog workLog) throws URISyntaxException {
        log.debug("REST request to update WorkLog : {}", workLog);
        if (workLog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        WorkLog result = workLogRepository.save(workLog);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, workLog.getId().toString()))
            .body(result);
    }

    /**
     * GET  /work-logs : get all the workLogs.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of workLogs in body
     */
    @GetMapping("/work-logs")
    @Timed
    public List<WorkLog> getAllWorkLogs() {
        log.debug("REST request to get all WorkLogs");
        return workLogRepository.findAll();
    }

    /**
     * GET  /work-logs/:id : get the "id" workLog.
     *
     * @param id the id of the workLog to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the workLog, or with status 404 (Not Found)
     */
    @GetMapping("/work-logs/{id}")
    @Timed
    public ResponseEntity<WorkLog> getWorkLog(@PathVariable Long id) {
        log.debug("REST request to get WorkLog : {}", id);
        Optional<WorkLog> workLog = workLogRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(workLog);
    }

    /**
     * DELETE  /work-logs/:id : delete the "id" workLog.
     *
     * @param id the id of the workLog to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/work-logs/{id}")
    @Timed
    public ResponseEntity<Void> deleteWorkLog(@PathVariable Long id) {
        log.debug("REST request to delete WorkLog : {}", id);

        workLogRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
