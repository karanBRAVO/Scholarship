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
