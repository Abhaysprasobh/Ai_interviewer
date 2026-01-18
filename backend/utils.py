import logging
import datetime

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger("AI-INTERVIEWER")


# util function get current time

def currentTime():
    return datetime.now()