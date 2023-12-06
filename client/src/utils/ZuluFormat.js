export const getLocaleTime = (utcTimeString) => {
  const utcDate = new Date(utcTimeString);

  const localTimeString = utcDate.toLocaleString();
  return localTimeString;
};

export const checkGreaterTime = (specificDateTimeString) => {
  const specificDateTime = new Date(specificDateTimeString);
  const currentDateTime = new Date();

  if (currentDateTime > specificDateTime) {
    return false;
  }
  return true;
};

export const getAvailableTime = (startTimeString, endTimeString) => {
  // Parse ISO strings to Date objects
  const startTime = new Date(startTimeString);
  const endTime = new Date(endTimeString);

  // Calculate the time difference in milliseconds
  const timeDifferenceInMilliseconds = endTime - startTime;

  // Convert milliseconds to hours, minutes, and seconds
  const hours = Math.floor(timeDifferenceInMilliseconds / (1000 * 60 * 60));
  const minutes = Math.floor(
    (timeDifferenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor(
    (timeDifferenceInMilliseconds % (1000 * 60)) / 1000
  );

  // Format the result as "hh:mm:ss"
  const formattedTimeDifference = `${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return formattedTimeDifference;
};
