export function isOverlap(day, start, end, routine) {
  const activities = routine[day];

  const startTime = new Date(`01/01/2000 ${start}`).getTime();
  const endTime = new Date(`01/01/2000 ${end}`).getTime();

  for (const activity of activities) {
    const activityStartTime = new Date(
      `01/01/2000 ${activity.start}`
    ).getTime();
    const activityEndTime = new Date(`01/01/2000 ${activity.end}`).getTime();

    if (
      (startTime >= activityStartTime && startTime < activityEndTime) ||
      (endTime > activityStartTime && endTime <= activityEndTime) ||
      (startTime <= activityStartTime && endTime >= activityEndTime)
    ) {
      return true;
    }
  }
  return false;
}

export function isActive(start, end) {
  const now = new Date();
  const startTime = new Date(now.toDateString() + " " + start);
  const endTime = new Date(now.toDateString() + " " + end);
  return now >= startTime && now <= endTime;
}

export const sortActivities = (activities) => {
  return activities.sort((a, b) => {
    const timeA = new Date(`01/01/2000 ${a.start}`);
    const timeB = new Date(`01/01/2000 ${b.start}`);
    return timeA - timeB;
  });
};
