package com.newsaggregator.mainservice.repository

import com.newsaggregator.mainservice.model.UserSource
import com.newsaggregator.mainservice.model.UserSourceId
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface UserSourceRepository : JpaRepository<UserSource, UserSourceId> {
    @Query("SELECT us FROM UserSource us WHERE us.user.userId = :userId")
    fun findByUserId(@Param("userId") userId: Long): List<UserSource>
    
    fun existsByUserUserIdAndSourceSourceId(userId: Long, sourceId: Long): Boolean
}

