package com.newsaggregator.mainservice.repository

import com.newsaggregator.mainservice.model.Source
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SourceRepository : JpaRepository<Source, Long> {
    fun findByName(name: String): Source?
}

