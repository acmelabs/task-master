package com.smart.taskmaster.repository;

import com.smart.taskmaster.domain.WorkLog;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the WorkLog entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorkLogRepository extends JpaRepository<WorkLog, Long> {

}
