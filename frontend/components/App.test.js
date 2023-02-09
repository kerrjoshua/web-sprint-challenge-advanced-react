import React from 'react'
import AppFunctional from './AppFunctional'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'

// Write your tests here

beforeEach( () => {render(<AppFunctional/>)})
test('App renders without errors', () => {
  render(<AppFunctional />)
})

test('Coordinates header renders to screen with correct starting text', () => {
 const coordinatesHeader =  screen.queryByText(/coordinates \(2,2\)/i)
  
 expect(coordinatesHeader).toBeTruthy();

})

test('Moves header renders to screen with correct starting text', () => {
  const movesHeader = screen.queryByText(/you moved 0 times/i);
  
  expect(movesHeader).toBeTruthy();
})

test('up button exists on screen', ()=> {
  expect(screen.getByText(/up/i)).toBeTruthy();
})

test('active square starts out at index 4 and adjusts appropriately to clicks of up and right buttons', () => {
  const indexOfActive = () => {
    const squares = Array.from(document.querySelectorAll('.square'))
    return squares.reduce((acc,sqr,idx) => {
    if (Array.from(sqr.classList).includes('active')) acc = idx;
    return acc
  }, 0)}
  const up = screen.getByText(/up/i);
  const right = screen.getByText(/right/i);

  expect(indexOfActive()).toBe(4);

  fireEvent.click(up)
  fireEvent.click(right);
  fireEvent.click(right);

  expect(indexOfActive()).toBe(2)
  expect(screen.getByText("You can't go right")).toBeTruthy();

})

test('email input accepts and displays user typing', async () => {
  const user = userEvent.setup();
  render(<AppFunctional />)
  const emailInput = document.querySelector('#email');
  expect(emailInput.value).toBe("");

  await user.type(emailInput, 'Hello');

  expect(screen.getByDisplayValue(/hello/i)).toBeTruthy();
})