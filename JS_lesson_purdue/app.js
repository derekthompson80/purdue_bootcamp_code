document.addEventListener('DOMContentLoaded', () => {
  // Elements for the custom prompt overlay
  const overlay = document.getElementById('customPromptOverlay');
  const messageEl = document.getElementById('promptMessage');
  const inputEl = document.getElementById('promptInput');
  const okBtn = document.getElementById('promptOkButton');
  const cancelBtn = document.getElementById('promptCancelButton');

  function showOverlay() {
    overlay.style.display = 'flex';
    // Ensure the flex centering works (CSS hides by default)
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
  }

  function hideOverlay() {
    overlay.style.display = 'none';
  }

  // Promise-based custom prompt
  function customPrompt(message) {
    return new Promise((resolve) => {
      messageEl.textContent = message;
      inputEl.value = '';
      showOverlay();
      inputEl.focus();

      function cleanup() {
        hideOverlay();
        okBtn.removeEventListener('click', onOk);
        cancelBtn.removeEventListener('click', onCancel);
        document.removeEventListener('keydown', onKey);
      }

      function onOk() {
        const v = inputEl.value;
        cleanup();
        resolve(v);
      }

      function onCancel() {
        cleanup();
        resolve(null);
      }

      function onKey(e) {
        if (e.key === 'Enter') {
          onOk();
        } else if (e.key === 'Escape') {
          onCancel();
        }
      }

      okBtn.addEventListener('click', onOk);
      cancelBtn.addEventListener('click', onCancel);
      document.addEventListener('keydown', onKey);
    });
  }

  // Sequentially gather inputs using the custom prompt
  (async function runTripPlanner() {
    const personName = await customPrompt('What is your name?');
    if (personName === null || personName.trim() === '') {
      document.getElementById('tripSummary').textContent = 'Trip cancelled. Please refresh to try again.';
      return;
    }

    const destinationOfTrip = await customPrompt('What destination do you want to visit?');
    if (destinationOfTrip === null || destinationOfTrip.trim() === '') {
      document.getElementById('tripSummary').textContent = 'Trip cancelled. Please refresh to try again.';
      return;
    }

    const numberOfDaysStr = await customPrompt('How many days do you want to stay?');
    const numberOfDays = parseInt((numberOfDaysStr || '').trim(), 10);

    const budgetPerDayStr = await customPrompt('What is your daily budget?');
    const budgetPerDay = parseInt((budgetPerDayStr || '').trim(), 10);

    if (Number.isNaN(numberOfDays) || Number.isNaN(budgetPerDay)) {
      document.getElementById('tripSummary').textContent = 'Please refresh and enter valid numbers for days and budget.';
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

    document.getElementById('tripSummary').textContent = tripSummary;
  })();
});