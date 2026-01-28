export function reorder(list, fromIndex, toIndex) {
  const updated = [...list];
  const [removed] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, removed);
  return updated;
}

export function moveItem(sourceList, destList, fromIndex, toIndex) {
  const sourceClone = [...sourceList];
  const destClone = [...destList];

  const [removed] = sourceClone.splice(fromIndex, 1);
  destClone.splice(toIndex, 0, removed);

  return {
    source: sourceClone,
    destination: destClone,
  };
}

export const initialBoards = [
  {
    id: "b1",
    name: "Personal Tasks ",
    lists: {
      todo: {
        id: "todo",
        name: "To Do",
        tasks: [
          { id: "t1", text: "Go to the market and buy fruits and veggies " },
          { id: "t2", text: "Book a haircut appointment for the weekend " },
          { id: "t3", text: "Refill water bottle and drink more water today " },
          { id: "t4", text: "Call mom and update her about the week " },
          { id: "t20", text: "Schedule a general health checkup " },
          { id: "t21", text: "Renew mobile recharge plan " },
          { id: "t22", text: "Clean shoes and arrange them properly " },
          { id: "t23", text: "Plan meals for the next three days " },
        ],
      },
      doing: {
        id: "doing",
        name: "Doing",
        tasks: [
          { id: "t5", text: "Fix sleep schedule by sleeping 30 mins earlier " },
          { id: "t6", text: "Clean the desk and organize all cables neatly " },
          { id: "t7", text: "Spend 20 minutes stretching and relaxing " },
          { id: "t24", text: "Reduce screen time before bed " },
          { id: "t25", text: "Practice mindful breathing for 10 minutes " },
          { id: "t26", text: "Declutter email inbox gradually " },
          { id: "t27", text: "Read 10 pages of a book " },
        ],
      },
      done: {
        id: "done",
        name: "Done",
        tasks: [
          { id: "t8", text: "Paid electricity bill " },
          {
            id: "t9",
            text: "Cleaned phone storage and deleted old screenshots ",
          },
          { id: "t10", text: "Sort laundry and wash dark clothes separately " },
          { id: "t28", text: "Updated grocery list " },
          { id: "t29", text: "Watered all indoor plants " },
          { id: "t30", text: "Backed up important photos " },
          { id: "t31", text: "Organized wallet and removed old receipts " },
        ],
      },
    },
  },

  {
    id: "b2",
    name: "Work Sprint ",
    lists: {
      backlog: {
        id: "backlog",
        name: "Backlog",
        tasks: [
          {
            id: "t11",
            text: "Add board create dialog with validation and nice UI ",
          },
          {
            id: "t12",
            text: "Add delete confirmation modal for boards and lists ",
          },
          { id: "t13", text: "Add task counter badge per list " },
          { id: "t32", text: "Add keyboard shortcuts for power users " },
          { id: "t33", text: "Implement board rename inline editing " },
          { id: "t34", text: "Add drag handle icon to task cards " },
          { id: "t35", text: "Persist board state to local storage " },
        ],
      },
      inprogress: {
        id: "inprogress",
        name: "In Progress",
        tasks: [
          { id: "t14", text: "Refactor list component to reusable UI blocks " },
          { id: "t15", text: "Fix long text overflow in task cards properly " },
          { id: "t16", text: "Polish responsive layout for smaller screens " },
          { id: "t36", text: "Improve accessibility with proper ARIA labels " },
          { id: "t37", text: "Optimize drag performance for large lists " },
          { id: "t38", text: "Refactor state logic into custom hooks " },
          { id: "t39", text: "Add loading skeletons for lists and tasks " },
        ],
      },
      done: {
        id: "done",
        name: "Done",
        tasks: [
          { id: "t17", text: "Setup routing for /boards and /boards/:id " },
          {
            id: "t18",
            text: "Improve drag and drop placeholder spacing and animation ",
          },
          {
            id: "t19",
            text: "Add empty states: no boards, no lists, no tasks ",
          },
          { id: "t40", text: "Standardize spacing and typography styles " },
          { id: "t41", text: "Extract reusable modal component " },
          { id: "t42", text: "Add basic error boundaries " },
          { id: "t43", text: "Setup ESLint and Prettier configuration " },
        ],
      },
    },
  },

  {
    id: "b3",
    name: "Fresh Ideas ",
    lists: {},
  },
];
