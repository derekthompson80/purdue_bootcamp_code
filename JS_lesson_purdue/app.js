document.addEventListener('DOMContentLoaded', () => {
  const summaryEl = document.getElementById('tripSummary');

  const personName = prompt('What is your name?');
  if (!personName || personName.trim() === '') {
    summaryEl.textContent = 'Trip cancelled. Please refresh to try again.';
    return;
  }

  const destinationOfTrip = prompt('What destination do you want to visit?');
  if (!destinationOfTrip || destinationOfTrip.trim() === '') {
    summaryEl.textContent = 'Trip cancelled. Please refresh to try again.';
    return;
  }

  const numberOfDaysStr = prompt('How many days do you want to stay?');
  const numberOfDays = parseInt((numberOfDaysStr || '').trim(), 10);

  const budgetPerDayStr = prompt('What is your daily budget?');
  const budgetPerDay = parseInt((budgetPerDayStr || '').trim(), 10);

  if (Number.isNaN(numberOfDays) || Number.isNaN(budgetPerDay)) {
    summaryEl.textContent = 'Please refresh and enter valid numbers for days and budget.';
    return;
  }

  const totalTripCost = numberOfDays * budgetPerDay;
  const totalTripCostWithSouvenirs = totalTripCost + 100;
  const travelTimeDays = numberOfDays + numberOfDays / 12; // example extra time

  console.log(`Name of traveler: ${personName}`);
  console.log(`Destination of Trip: ${destinationOfTrip}`);
  console.log(`Total travel time of Trip: ${travelTimeDays} days`);
  console.log(`Total trip cost: ${totalTripCostWithSouvenirs} dollars`);

  let tripSummary = `Hello ${personName}, your trip to ${destinationOfTrip} is confirmed and you will be staying for ${numberOfDays} days.\n`;
  tripSummary += `Your total cost for the trip is $${totalTripCostWithSouvenirs}.\n`;
  tripSummary += `The total travel time is ${travelTimeDays} days.`;

  summaryEl.textContent = tripSummary;
});