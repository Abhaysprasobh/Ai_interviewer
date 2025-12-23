def normalize_score(raw_score):
    return min(max(raw_score, 0), 10)
