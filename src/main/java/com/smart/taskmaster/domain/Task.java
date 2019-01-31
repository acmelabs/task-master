package com.smart.taskmaster.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.smart.taskmaster.domain.enumeration.Priority;

import com.smart.taskmaster.domain.enumeration.TaskStatus;

import com.smart.taskmaster.domain.enumeration.TaskType;

import com.smart.taskmaster.domain.enumeration.QuantityType;

/**
 * A Task.
 */
@Entity
@Table(name = "task")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Task implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "task_name")
    private String taskName;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private Priority priority;

    @Column(name = "due_date")
    private Instant dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "task_type")
    private TaskType taskType;

    @Enumerated(EnumType.STRING)
    @Column(name = "quantity_type")
    private QuantityType quantityType;

    @Column(name = "estimated_quantity")
    private Integer estimatedQuantity;

    @Column(name = "note")
    private String note;

    @Column(name = "jhi_order")
    private Integer order;

    @OneToMany(mappedBy = "task")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<TaskItems> taskItems = new HashSet<>();
    @OneToMany(mappedBy = "task")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<WorkLog> workLogs = new HashSet<>();
    @OneToOne(mappedBy = "task")
    @JsonIgnore
    private Reminder reminder;

    @ManyToOne
    @JsonIgnoreProperties("tasks")
    private Project project;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTaskName() {
        return taskName;
    }

    public Task taskName(String taskName) {
        this.taskName = taskName;
        return this;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public Priority getPriority() {
        return priority;
    }

    public Task priority(Priority priority) {
        this.priority = priority;
        return this;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Instant getDueDate() {
        return dueDate;
    }

    public Task dueDate(Instant dueDate) {
        this.dueDate = dueDate;
        return this;
    }

    public void setDueDate(Instant dueDate) {
        this.dueDate = dueDate;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public Task status(TaskStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public TaskType getTaskType() {
        return taskType;
    }

    public Task taskType(TaskType taskType) {
        this.taskType = taskType;
        return this;
    }

    public void setTaskType(TaskType taskType) {
        this.taskType = taskType;
    }

    public QuantityType getQuantityType() {
        return quantityType;
    }

    public Task quantityType(QuantityType quantityType) {
        this.quantityType = quantityType;
        return this;
    }

    public void setQuantityType(QuantityType quantityType) {
        this.quantityType = quantityType;
    }

    public Integer getEstimatedQuantity() {
        return estimatedQuantity;
    }

    public Task estimatedQuantity(Integer estimatedQuantity) {
        this.estimatedQuantity = estimatedQuantity;
        return this;
    }

    public void setEstimatedQuantity(Integer estimatedQuantity) {
        this.estimatedQuantity = estimatedQuantity;
    }

    public String getNote() {
        return note;
    }

    public Task note(String note) {
        this.note = note;
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Integer getOrder() {
        return order;
    }

    public Task order(Integer order) {
        this.order = order;
        return this;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public Set<TaskItems> getTaskItems() {
        return taskItems;
    }

    public Task taskItems(Set<TaskItems> taskItems) {
        this.taskItems = taskItems;
        return this;
    }

    public Task addTaskItems(TaskItems taskItems) {
        this.taskItems.add(taskItems);
        taskItems.setTask(this);
        return this;
    }

    public Task removeTaskItems(TaskItems taskItems) {
        this.taskItems.remove(taskItems);
        taskItems.setTask(null);
        return this;
    }

    public void setTaskItems(Set<TaskItems> taskItems) {
        this.taskItems = taskItems;
    }

    public Set<WorkLog> getWorkLogs() {
        return workLogs;
    }

    public Task workLogs(Set<WorkLog> workLogs) {
        this.workLogs = workLogs;
        return this;
    }

    public Task addWorkLog(WorkLog workLog) {
        this.workLogs.add(workLog);
        workLog.setTask(this);
        return this;
    }

    public Task removeWorkLog(WorkLog workLog) {
        this.workLogs.remove(workLog);
        workLog.setTask(null);
        return this;
    }

    public void setWorkLogs(Set<WorkLog> workLogs) {
        this.workLogs = workLogs;
    }

    public Reminder getReminder() {
        return reminder;
    }

    public Task reminder(Reminder reminder) {
        this.reminder = reminder;
        return this;
    }

    public void setReminder(Reminder reminder) {
        this.reminder = reminder;
    }

    public Project getProject() {
        return project;
    }

    public Task project(Project project) {
        this.project = project;
        return this;
    }

    public void setProject(Project project) {
        this.project = project;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Task task = (Task) o;
        if (task.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), task.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Task{" +
            "id=" + getId() +
            ", taskName='" + getTaskName() + "'" +
            ", priority='" + getPriority() + "'" +
            ", dueDate='" + getDueDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", taskType='" + getTaskType() + "'" +
            ", quantityType='" + getQuantityType() + "'" +
            ", estimatedQuantity=" + getEstimatedQuantity() +
            ", note='" + getNote() + "'" +
            ", order=" + getOrder() +
            "}";
    }
}
