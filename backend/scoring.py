from typing import Dict, Any


def normalize_score(raw_score: float) -> float:
    """Clamp a raw numeric score to the inclusive range [0.0, 10.0].

    Accepts ints or floats (or numeric strings). Raises ValueError for non-numeric input.
    """
    try:
        value = float(raw_score)
    except (TypeError, ValueError):
        raise ValueError("raw_score must be a number or numeric string")
    if value != value:  # catch NaN
        raise ValueError("raw_score must be a finite number")
    return max(0.0, min(10.0, value))


def to_percentage(normalized_score: float) -> int:
    """Convert a normalized 0-10 score to a 0-100 integer percentage."""
    ns = normalize_score(normalized_score)
    return int(round(ns * 10))


def grade_label(normalized_score: float) -> str:
    """Return a human-friendly label for a normalized score.

    Thresholds:
    - [0.0, 4.0): 'Poor'
    - [4.0, 6.0): 'Fair'
    - [6.0, 8.0): 'Good'
    - [8.0, 10.0]: 'Excellent'
    """
    ns = normalize_score(normalized_score)
    if ns < 4.0:
        return "Poor"
    if ns < 6.0:
        return "Fair"
    if ns < 8.0:
        return "Good"
    return "Excellent"


def compute_final_score(raw_score: float, weight: float = 1.0) -> Dict[str, Any]:
    """Compute a final score summary from a raw score and optional weight.

    Returns a dict with keys: `normalized` (0-10 float), `percentage` (0-100 int),
    `label` (string), and `weighted` (normalized score after applying weight and clamping).
    """
    normalized = normalize_score(raw_score)
    try:
        w = float(weight)
    except (TypeError, ValueError):
        raise ValueError("weight must be numeric")
    weighted = normalize_score(normalized * w)
    return {
        "normalized": normalized,
        "percentage": to_percentage(normalized),
        "label": grade_label(normalized),
        "weighted": weighted,
    }


def _simple_preprocess(text: str) -> str:
    if not isinstance(text, str):
        return ""
    import re

    t = text.lower()
    t = re.sub(r"[^a-z0-9\s]", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


def compute_qa_score(
    expected: str,
    answer: str,
    keywords: list | None = None,
    weights: dict | None = None,
) -> Dict[str, Any]:
    """Compute a QA score from the expected answer and a candidate answer.

    Method (fast, deterministic):
    - keyword match (if `keywords` provided)
    - token overlap (Jaccard-like)
    - sequence similarity (difflib ratio)

    Returns the full final score object (see `compute_final_score`).
    """
    from difflib import SequenceMatcher

    if weights is None:
        weights = {"keywords": 0.5, "overlap": 0.3, "seq": 0.2}

    # preprocess
    exp = _simple_preprocess(expected)
    ans = _simple_preprocess(answer)

    # keyword score
    kw_score = 0.0
    if keywords:
        # split into keywords if required keywords exists
        if isinstance(keywords, str):
            # string
            kws = [k.strip().lower() for k in keywords.split(",") if k.strip()]
        else:
            # not string to string
            kws = [str(k).strip().lower() for k in keywords if str(k).strip()]
        if kws:
            found = 0
            for k in kws:
                if k in ans:
                    found += 1
            kw_score = found / len(kws)

    # token overlap (Jaccard-like)
    set_exp = set(exp.split())
    set_ans = set(ans.split())
    overlap = 0.0
    if set_exp or set_ans:
        inter = set_exp.intersection(set_ans)
        union = set_exp.union(set_ans)
        overlap = len(inter) / max(1, len(union))

    # sequence similarity
    seq_ratio = 0.0
    if exp or ans:
        seq_ratio = SequenceMatcher(None, exp, ans).ratio()

    # combine weighted (all parts are 0..1). result scaled to 0..10
    kw_w = float(weights.get("keywords", 0))
    ov_w = float(weights.get("overlap", 0))
    seq_w = float(weights.get("seq", 0))
    total_w = max(kw_w + ov_w + seq_w, 1e-9)
    combined = (kw_score * kw_w + overlap * ov_w + seq_ratio * seq_w) / total_w
    raw_score_0_10 = combined * 10.0

    return compute_final_score(raw_score_0_10)


