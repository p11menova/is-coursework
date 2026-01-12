package com.newsaggregator.mainservice.model

import jakarta.persistence.*

@Entity
@Table(name = "categories")
data class Category(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    val categoryId: Long = 0,
    
    @Column(name = "name", nullable = false, unique = true, length = 100)
    val name: String,
    
    @Column(name = "description", columnDefinition = "TEXT")
    val description: String? = null
)

