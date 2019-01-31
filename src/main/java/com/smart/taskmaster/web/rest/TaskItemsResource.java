package com.smart.taskmaster.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.smart.taskmaster.domain.TaskItems;
import com.smart.taskmaster.repository.TaskItemsRepository;
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
 * REST controller for managing TaskItems.
 */
@RestController
@RequestMapping("/api")
public class TaskItemsResource {

    private final Logger log = LoggerFactory.getLogger(TaskItemsResource.class);

    private static final String ENTITY_NAME = "taskItems";

    private final TaskItemsRepository taskItemsRepository;

    public TaskItemsResource(TaskItemsRepository taskItemsRepository) {
        this.taskItemsRepository = taskItemsRepository;
    }

    /**
     * POST  /task-items : Create a new taskItems.
     *
     * @param taskItems the taskItems to create
     * @return the ResponseEntity with status 201 (Created) and with body the new taskItems, or with status 400 (Bad Request) if the taskItems has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/task-items")
    @Timed
    public ResponseEntity<TaskItems> createTaskItems(@RequestBody TaskItems taskItems) throws URISyntaxException {
        log.debug("REST request to save TaskItems : {}", taskItems);
        if (taskItems.getId() != null) {
            throw new BadRequestAlertException("A new taskItems cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TaskItems result = taskItemsRepository.save(taskItems);
        return ResponseEntity.created(new URI("/api/task-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /task-items : Updates an existing taskItems.
     *
     * @param taskItems the taskItems to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated taskItems,
     * or with status 400 (Bad Request) if the taskItems is not valid,
     * or with status 500 (Internal Server Error) if the taskItems couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/task-items")
    @Timed
    public ResponseEntity<TaskItems> updateTaskItems(@RequestBody TaskItems taskItems) throws URISyntaxException {
        log.debug("REST request to update TaskItems : {}", taskItems);
        if (taskItems.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TaskItems result = taskItemsRepository.save(taskItems);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, taskItems.getId().toString()))
            .body(result);
    }

    /**
     * GET  /task-items : get all the taskItems.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of taskItems in body
     */
    @GetMapping("/task-items")
    @Timed
    public List<TaskItems> getAllTaskItems() {
        log.debug("REST request to get all TaskItems");
        return taskItemsRepository.findAll();
    }

    /**
     * GET  /task-items/:id : get the "id" taskItems.
     *
     * @param id the id of the taskItems to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the taskItems, or with status 404 (Not Found)
     */
    @GetMapping("/task-items/{id}")
    @Timed
    public ResponseEntity<TaskItems> getTaskItems(@PathVariable Long id) {
        log.debug("REST request to get TaskItems : {}", id);
        Optional<TaskItems> taskItems = taskItemsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(taskItems);
    }

    /**
     * DELETE  /task-items/:id : delete the "id" taskItems.
     *
     * @param id the id of the taskItems to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/task-items/{id}")
    @Timed
    public ResponseEntity<Void> deleteTaskItems(@PathVariable Long id) {
        log.debug("REST request to delete TaskItems : {}", id);

        taskItemsRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
