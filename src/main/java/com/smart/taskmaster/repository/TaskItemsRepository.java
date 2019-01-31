package com.smart.taskmaster.repository;

import com.smart.taskmaster.domain.TaskItems;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the TaskItems entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TaskItemsRepository extends JpaRepository<TaskItems, Long> {

}
