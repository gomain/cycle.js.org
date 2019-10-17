import { div, label, input } from '@cycle/dom';

export function Slider ({ DOM: domSource, props: props$ }) {
  const newValue$ = domSource
    .select('.slider').events('input')
    .map(ev => ev.target.value);
  const state$ = props$
    .map(props => newValue$
      .map(newValue => props::assign({ value: newValue }))
      .startWith(props))
    .flatten()
    .remember();
  return {
    DOM: state$.map(({ _label, unit, min, max, value }) =>
      div('.labeled-slider', [
        label('.label', `${_label}: ${value} ${unit}`),
        input('.slider', { attrs: { type: 'range', min, max, value } })
      ])),
    value: state$.map(props => props.value)
  };
}

function assign (obj) {
  return Object.assign(this, obj);
}
