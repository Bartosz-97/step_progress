const steps = document.querySelectorAll('.stp');
const circleSteps = document.querySelectorAll('.point');
const formInputs = document.querySelectorAll('.step-1 form .label__content input');
const labelContent = document.querySelectorAll('.label__content label');
const plans = document.querySelectorAll('.card');
const switcher = document.querySelector('.switch');
const options = document.querySelectorAll('.option');
const total = document.querySelector('.total b');
const planPrice = document.querySelector('.option__priced');
const confirmBtn = document.querySelector('.confirm__btn');

let time;
let currentStep = 1;
let currentCircle = 0;

const obj = {
  plan: null,
  kind: null,
  price: null
};

steps.forEach((step) => {
  const nextBtn = step.querySelector('.next_btn');
  const prevBtn = step.querySelector('.prev__btn');


  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      document.querySelector(`.step-${currentStep}`).style.display = 'none';
      circleSteps[currentCircle].classList.remove('point__active');
      currentStep--;
      document.querySelector(`.step-${currentStep}`).style.display = 'flex';
      currentCircle--;
      circleSteps[currentCircle].classList.add('point__active');
    })
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      document.querySelector(`.step-${currentStep}`).style.display = 'none';
      if (currentStep < 5 && validateForm()) {
        currentStep++;
        currentCircle++;
        setTotal();
      }
      circleSteps[currentCircle].classList.remove('point__active');
      document.querySelector(`.step-${currentStep}`).style.display = 'flex'
      circleSteps[currentCircle].classList.add('point__active');
      summary(obj);
    });
  }
})

confirmBtn.addEventListener('click', () => {
  document.querySelector(`.step-${currentStep}`).style.display = 'none';
  currentStep++;
  document.querySelector(`.step-${currentStep}`).style.display = 'flex';
})

function summary(obj) {
  const planName = document.querySelector(".plan__name");
  const planPrice = document.querySelector(".option__priced");
  planPrice.innerHTML = `${obj.price.innerText}`;
  planName.innerHTML = `${obj.plan.innerText} (${
      obj.kind ? "yearly" : "monthly"
  })`;
}

const validateForm = () => {
  let valid = true;

  for (let i = 0; i < formInputs.length; i++) {
    if(!formInputs[i].value) {
      valid = false;
      labelContent[i].nextElementSibling.style.display = 'flex';
    } else {
      valid = true;
      labelContent[i].nextElementSibling.style.display = 'none';
    }
  }
  return valid;
}

plans.forEach((plan) => {
  plan.addEventListener('click', () => {
    const cardSelected = document.querySelector('.card--selected');
    cardSelected.classList.remove('card--selected');
    plan.classList.add('card--selected');
    const planName = plan.querySelector('.card__heading');
    const planPrice = plan.querySelector('.card__price');

    obj.plan = planName;
    obj.price = planPrice;
  });
})

switcher.addEventListener('click', () => {
  const valueSwitch = switcher.querySelector('input').checked;

  if (valueSwitch) {
    document.querySelector('.monthly').classList.remove('sw-active');
    document.querySelector('.yearly').classList.add('sw-active');
  } else {
    document.querySelector('.monthly').classList.add('sw-active');
    document.querySelector('.yearly').classList.remove('sw-active');
  }
  switchPrice(valueSwitch);
  obj.kind = valueSwitch;
});

options.forEach((addon) => {
  addon.addEventListener('click', (e) => {
    const addonSelect = addon.querySelector('input');
    const ID = addon.getAttribute('data-id');
    if (addonSelect.checked) {
      addonSelect.checked = false;
      addon.classList.remove('selected');
      showAddon(ID, false);
    } else {
      addonSelect.checked = true;
      addonSelect.classList.add('selected');
      showAddon(addon, true);
      e.preventDefault();
    }
  })
})

function switchPrice(checked) {
  const yearlyPrice = [90, 120, 150];
  const monthlyPrice = [9, 12, 15];
  const prices = document.querySelectorAll('.card__price');

  if (checked) {
    prices[0].innerHTML = `$${yearlyPrice[0]}/yr`;
    prices[1].innerHTML = `$${yearlyPrice[1]}/yr`;
    prices[2].innerHTML = `$${yearlyPrice[2]}/yr`;
    setTime(true)
  } else {
    prices[0].innerHTML = `$${monthlyPrice[0]}/mo`;
    prices[1].innerHTML = `$${monthlyPrice[1]}/mo`;
    prices[2].innerHTML = `$${monthlyPrice[2]}/mo`;
    setTime(false)
  }
}

const showAddon = (ad, valueSwitch) => {
  const temp = document.getElementsByTagName("template")[0];
  const clone = temp.content.cloneNode(true);
  const serviceName = clone.querySelector('.service__name');
  const servicePrice = clone.querySelector('.service__price');
  const serviceID = clone.querySelector('.selected__addon');

  if (ad && valueSwitch) {
    serviceName.innerText = ad.querySelector('label').innerText;
    servicePrice.innerText = ad.querySelector('.option__price').innerText;
    serviceID.setAttribute("data-id", ad.dataset.id);
    document.querySelector(".addons").appendChild(clone);
  } else {
    const addons = document.querySelectorAll(".selected-addon");
    addons.forEach((addon) => {
      const attr = addon.getAttribute("data-id");
      if (attr == ad) {
        addon.remove();
      }
    });
  }
}

function setTotal() {
  const str = planPrice.innerHTML;
  const res = str.replace(/\D/g, "");
  const addonPrices = document.querySelectorAll('.selected__addon .service__price');

  let val = 0;
  for (let i=0; i < addonPrices.length; i++) {
    const str = addonPrices[i].innerHTML;
    const res = str.replace(/\D/g, '');

    val += Number(res);
  }
  total.innerHTML = `$${val + Number(res)}/${time?"yr":"mo"}`;
}

function setTime(t) {
  return time = t;
}