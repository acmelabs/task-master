package com.smart.taskmaster.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A Reminder.
 */
@Entity
@Table(name = "reminder")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Reminder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reminder_date")
    private Instant reminderDate;

    @OneToOne    @JoinColumn(unique = true)
    private Task task;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getReminderDate() {
        return reminderDate;
    }

    public Reminder reminderDate(Instant reminderDate) {
        this.reminderDate = reminderDate;
        return this;
    }

    public void setReminderDate(Instant reminderDate) {
        this.reminderDate = reminderDate;
    }

    public Task getTask() {
        return task;
    }

    public Reminder task(Task task) {
        this.task = task;
        return this;
    }

    public void setTask(Task task) {
        this.task = task;
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
        Reminder reminder = (Reminder) o;
        if (reminder.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), reminder.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Reminder{" +
            "id=" + getId() +
            ", reminderDate='" + getReminderDate() + "'" +
            "}";
    }
}
