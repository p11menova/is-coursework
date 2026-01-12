package com.newsaggregator.rssparser.repository

import com.newsaggregator.rssparser.model.Source
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SourceRepository : JpaRepository<Source, Long>

