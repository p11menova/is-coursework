package com.newsaggregator.mainservice.repository

import com.newsaggregator.mainservice.model.News
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface NewsRepository : JpaRepository<News, Long> {
    fun findByUrl(url: String): News?
    
    @Query("SELECT n FROM News n WHERE n.category.categoryId = :categoryId ORDER BY n.publishedDate DESC")
    fun findByCategoryId(@Param("categoryId") categoryId: Long, pageable: Pageable): Page<News>
    
    @Query("""
        SELECT n FROM News n 
        WHERE n.source.sourceId IN (
            SELECT us.source.sourceId FROM UserSource us WHERE us.user.userId = :userId
        )
        ORDER BY n.publishedDate DESC
    """)
    fun findNewsForUser(@Param("userId") userId: Long, pageable: Pageable): Page<News>
}

