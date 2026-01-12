package com.newsaggregator.mainservice.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "news")
data class News(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "news_id")
    val newsId: Long = 0,
    
    @Column(name = "title", nullable = false, length = 500)
    val title: String,
    
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    val content: String,
    
    @Column(name = "url", nullable = false, unique = true, length = 500)
    val url: String,
    
    @Column(name = "image_url", length = 500)
    val imageUrl: String? = null,
    
    @Column(name = "published_date", nullable = false)
    val publishedDate: LocalDateTime,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id", nullable = false)
    val source: Source,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    val category: Category
)

