package com.newsaggregator.mainservice.model

import jakarta.persistence.*

@Entity
@Table(name = "sources")
data class Source(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "source_id")
    val sourceId: Long = 0,
    
    @Column(name = "name", nullable = false, unique = true, length = 255)
    val name: String,
    
    @Column(name = "url", nullable = false, unique = true, length = 500)
    val url: String,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    val category: Category,
    
    @Column(name = "rss_url", nullable = false, length = 500)
    val rssUrl: String
)

