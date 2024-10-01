// timeUtils.ts (or you can put this directly in your JobCard component)
export const timeAgo = (postedTime: string): string => {
    if(postedTime[1] === " " )
        return postedTime;
    const postDate = new Date(postedTime);
    const now = new Date();
    const secondsDiff = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    
    const daysDiff = Math.floor(secondsDiff / (60 * 60 * 24));
  
    if (daysDiff === 0) return "Today"; // Optional: Handle the case for today
    if (daysDiff === 1) return "1 day ago";
    return `${daysDiff} days ago`;
  };
  