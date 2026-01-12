package com.newsaggregator.rssparser.repository

import com.newsaggregator.rssparser.model.News
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface NewsRepository : JpaRepository<News, Long> {
    fun findByUrl(url: String): News?
}

