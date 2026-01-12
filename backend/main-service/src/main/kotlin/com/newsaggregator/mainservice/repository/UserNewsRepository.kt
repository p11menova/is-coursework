package com.newsaggregator.mainservice.repository

import com.newsaggregator.mainservice.model.UserNews
import com.newsaggregator.mainservice.model.UserNewsId
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface UserNewsRepository : JpaRepository<UserNews, UserNewsId> {
    @Query("SELECT un FROM UserNews un WHERE un.user.userId = :userId AND un.news.newsId = :newsId")
    fun findByUserIdAndNewsId(@Param("userId") userId: Long, @Param("newsId") newsId: Long): UserNews?
    
    @Query("SELECT un FROM UserNews un WHERE un.user.userId = :userId")
    fun findByUserId(@Param("userId") userId: Long): List<UserNews>
    
    fun existsByUserUserIdAndNewsNewsId(userId: Long, newsId: Long): Boolean
}

