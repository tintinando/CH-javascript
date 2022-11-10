// tutorial obtenido de https://www.youtube.com/watch?v=tp9UAZrqb9s
class Calendar {
  constructor(id) {
    this.cells = [];
    this.selectedDate = null;
    this.selectHoursTimestamp = null;
    this.currentMonth = DateTime.now();
    this.elCalendar = document.getElementById(id);
    this.showTemplate();
    this.elMonthName = this.elCalendar.querySelector('.month-name');
    this.elGridBody = this.elCalendar.querySelector('.grid__body');
    this.busy = [];
    this.selectHours = this.elCalendar.querySelector('#selectHours');

    this.showCells();
    this.showSelector();
  }

  showTemplate() {
    // renderiza la plantilla que contendrá showCells()
    this.elCalendar.innerHTML = this.getTemplate();
    this.addEventListenerToControls();
  }

  getTemplate() {
    // HTML con encabezado del calendario y contenedor de las fechas
    const template = `
    <div class="calendar" id="calendar">
    <div class="calendar__header">
      <button type="button" class="control control--prev">&lt;</button>
      <span class="month-name"></span>
      <button type="button" class="control control--next">&gt;</button>
    </div>
    <div class="calendar_body">
      <div class="grid">
        <div class="grid__header">
          <span class="grid__cell grid__cell--gh">Lun</span>
          <span class="grid__cell grid__cell--gh">Mar</span>
          <span class="grid__cell grid__cell--gh">Mie</span>
          <span class="grid__cell grid__cell--gh">Jue</span>
          <span class="grid__cell grid__cell--gh">Vie</span>
          <span class="grid__cell grid__cell--gh">Sab</span>
          <span class="grid__cell grid__cell--gh">Dom</span>
        </div>
        <div class="grid__body">
        </div>
      </div>
    </div>
  </div>
  <div id="selectHours"></div>
  `;
    return template;
  }

  showCells() {
    // inserta el HTML de las fechas
    this.cells = this.generateDates(this.currentMonth);
    if (this.cells === null) {
      console.log('Error en generateDates');
      return;
    }

    this.elGridBody.innerHTML = '';
    let templateCells = '';

    for (let i = 0; i < this.cells.length; i += 1) {
      let disabledClass = '';
      if (!this.cells[i].isInCurrentMonth) disabledClass = 'grid__cell--disabled';
      templateCells += `
      <span class="grid__cell grid__cell--gd ${disabledClass}" data-cell-id="${i}">
        ${this.cells[i].date.day}
      </span>
      `;
    }
    this.elMonthName.innerHTML = this.currentMonth.toLocaleString({ month: 'long', year: 'numeric' });
    this.elGridBody.innerHTML = templateCells;
    this.addEventListenerToCells();
  }

  showSelector() {
    // genera el selector de horarios
    const arrHoras = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
    const arrMinutos = ['00', '30'];
    let html = '<select><option disabled selected hidden>Elegir horario</option>';

    // filtro solo los ocupados del día seleccionado
    const today = this.selectedDate || this.currentMonth.set({ hours: 0, minutes: 0 });

    const busyToday = this.busy.filter((f) => {
      return f.set({ hours: 0, minutes: 0 }).valueOf() === today.valueOf();
    });

    for (const hora of arrHoras) {
      for (const minuto of arrMinutos) {
        // agregar argumento disabled a los horarios ocupados de hoy
        let disabled = '';
        const isBusyToday = busyToday.some((f) => {
          return f.valueOf() === today.set({ hour: hora, minutes: minuto }).valueOf();
        });

        if (isBusyToday) {
          disabled = 'disabled';
        }
        html += `
          <option ${disabled} value="${hora}:${minuto}">${hora}:${minuto}</option>
        `;
      }
    }
    html += '</select><button type="submit" id="submitCalendar">Aceptar</button>';
    this.selectHours.innerHTML = html;

    this.selectHours.addEventListener('change', () => {
      // al elegir hora establece la propiedad con un objeto DateTime
      const selectHoursValue = this.selectHours.querySelector('select');
      const selectHoursHour = selectHoursValue.value.substring(0, 2);
      const selectHoursMinute = selectHoursValue.value.substring(3);
      const selectHoursTimestampPrev = this.selectedDate || this.currentMonth.set({
        hour: 0, minute: 0, second: 0, millisecond: 0,
      });

      this.selectHoursTimestamp = selectHoursTimestampPrev.plus({
        hours: selectHoursHour, minutes: selectHoursMinute,
      });
    });

    this.addEventListenerToSubmit();
  }

  generateDates(monthToShow = DateTime.now()) {
    // devuelve array con las 35 ó 42 celdas del mes
    if (!(monthToShow instanceof DateTime)) return null;

    let dateStart = monthToShow.startOf('month');
    let dateEnd = monthToShow.endOf('month');
    const cells = [];

    while (dateStart.weekday !== 1) {
      dateStart = dateStart.minus({ days: 1 });
    }

    while (dateEnd.weekday !== 7) {
      dateEnd = dateEnd.plus({ days: 1 });
    }

    do {
      cells.push({
        date: dateStart,
        isInCurrentMonth: dateStart.month === monthToShow.month,
      });
      dateStart = dateStart.plus({ days: 1 });
    } while (dateStart <= dateEnd);

    return cells;
  }

  addEventListenerToControls() {
    // botones para cambiar de mes
    const elControls = this.elCalendar.querySelectorAll('.control');
    elControls.forEach((elControl) => {
      elControl.addEventListener('click', (e) => {
        const elTarget = e.target;
        if (elTarget.classList.contains('control--next')) {
          this.changeMonth(true);
        } else {
          this.changeMonth(false);
        }
        this.showCells();
      });
    });
  }

  changeMonth(next = true) {
    // cambia el mes mostrado
    if (next) {
      this.currentMonth = this.currentMonth.plus({ months: 1 });
    } else {
      this.currentMonth = this.currentMonth.minus({ months: 1 });
    }
  }

  addEventListenerToCells() {
    // conducta al hacer clic en una fecha
    const elCells = this.elCalendar.querySelectorAll('.grid__cell--gd');
    elCells.forEach((elCell) => {
      elCell.addEventListener('click', (e) => {
        const elTarget = e.target;
        if (elTarget.classList.contains('grid__cell--disabled')
          || elTarget.classList.contains('grid__cell--selected')) {
          return;
        }
        const selectedCell = this.elGridBody.querySelector('.grid__cell--selected');
        if (selectedCell) {
          selectedCell.classList.remove('grid__cell--selected');
        }
        elTarget.classList.add('grid__cell--selected');

        // seleccionar nueva celda
        this.selectedDate = this.cells[parseInt(elTarget.dataset.cellId, 10)].date;
        this.showSelector();
        // avisa al listener que hubo un cambio en este objeto
        this.elCalendar.dispatchEvent(new Event('change'));
      });
    });
  }

  addEventListenerToSubmit() {
    const submitCalendar = this.elCalendar.querySelector('#submitCalendar');
    submitCalendar.addEventListener('click', () => {
      this.elCalendar.dispatchEvent(new Event('submit'));
    });
  }

  getElement() {
    return this.elCalendar;
  }

  value() {
    const return2 = this.selectHoursTimestamp || this.selectedDate;
    return return2;
  }

  setBusy(busy) {
    this.busy = busy;
    this.showSelector();
  }

  remove() {
    this.elCalendar.innerHTML = '';
  }
}
