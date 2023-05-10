export const navLinks = [
  { title: 'Home', path: '/' },
  { title: 'Library', path: '/library/public', activePath: '/library/study' },
];

export const navLinksAuth = [
  { title: 'My lessons', path: '/lessons', activePath: '/lessons' },
  { title: 'Library', path: '/library/public', activePath: '/library/study' },
  { title: 'Classes', path: '/teacher-classes', activePath: '/teacher-classes' },
];

export const accordionBtn = [
  { name: 'Use video', path: '/create-video-lesson' },
  { name: 'Use my own words', path: '/own-words' },
];

export const videoTab = [
  { title: 'Words', path: '/create-video-lesson' },
  { title: 'Activity', path: '/own-words' },
];

export const lessonsStates = [
  { title: 'Received', path: '/lessons?q=received' },
  { title: 'Saved', path: '/lessons?q=favorite' },
  { title: 'Created', path: '/lessons?q=created' },
];

export const lessonsStatesTeacher = [
  { title: 'Created', path: '/lessons?q=created' },
  { title: 'Saved', path: '/lessons?q=favorite' },
];

export const classesStatesTeacher = [
  { title: 'Created', path: '/teacher-classes' },
  { title: 'Joined', path: '/teacher-classes?q=joined' },
];

export const libraryStates = [
  { title: 'Public lessons', path: '/library/public', tabsName: 'public' },
  { title: 'Mobile apps', path: '/library/apps', tabsName: 'apps' },
  { title: 'Irregular verbs', path: '/library/study', tabsName: 'study' },
];

export const navBarBreadcrumps = [
  {
    href: '/lessons',
    name: 'Lessons',
  },
  {
    href: '/lessons',
    name: 'Lessons',
  },
];
