package com.newsaggregator.mainservice.model

import jakarta.persistence.*

@Entity
@Table(name = "templates")
data class Template(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "template_id")
    val templateId: Long = 0,
    
    @Column(name = "name", nullable = false, unique = true, length = 100)
    val name: String,
    
    @Column(name = "description", columnDefinition = "TEXT")
    val description: String? = null,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    val category: Category? = null
)

