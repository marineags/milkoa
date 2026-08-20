package com.milkao;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feed-costs")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class FeedCostController {

    private final FeedCostRepository feedCostRepository;

    public FeedCostController(FeedCostRepository feedCostRepository) {
        this.feedCostRepository = feedCostRepository;
    }

    @GetMapping
    public List<FeedCost> getAllFeedCosts() {
        return feedCostRepository.findAll();
    }
}