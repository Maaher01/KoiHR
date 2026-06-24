import { AbstractControl } from '@angular/forms';

export function endDateAfterStartDate(group: AbstractControl) {
  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;

  if (start && end && new Date(end) < new Date(start)) {
    return { endBeforeStart: true };
  }
  return null;
}
