package com.newsaggregator.rssparser.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "news")
class News(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "news_id")
    var newsId: Long = 0,
    
    @Column(name = "title", nullable = false, length = 500)
    var title: String = "",
    
    @Column(name = "content", columnDefinition = "TEXT")
    var content: String = "",
    
    @Column(name = "url", nullable = false, unique = true, length = 1000)
    var url: String = "",
    
    @Column(name = "image_url", length = 1000)
    var imageUrl: String? = null,
    
    @Column(name = "published_date", nullable = false)
    var publishedDate: LocalDateTime = LocalDateTime.now(),
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id", nullable = false)
    var source: Source? = null,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    var category: Category? = null
) {
    constructor() : this(0, "", "", "", null, LocalDateTime.now(), null, null)
}

