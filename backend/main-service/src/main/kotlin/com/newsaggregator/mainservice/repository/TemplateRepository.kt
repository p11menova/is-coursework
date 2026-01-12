package com.newsaggregator.mainservice.repository

import com.newsaggregator.mainservice.model.Template
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TemplateRepository : JpaRepository<Template, Long>

