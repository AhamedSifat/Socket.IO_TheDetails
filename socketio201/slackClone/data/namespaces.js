import Namespace from '../classes/Namespace.js';
import Room from '../classes/Room.js';

const wikiNs = new Namespace(
  0,
  '/Wikipedia',
  'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png',
  '/wiki',
);

const mozillaNs = new Namespace(
  1,
  '/Mozilla',
  'https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png',
  '/mozilla',
);

const linuxNs = new Namespace(
  2,
  '/Linux',
  'https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png',
  '/linux',
);

wikiNs.addRoom(new Room(0, 'New Articles', wikiNs.id));
wikiNs.addRoom(new Room(1, 'Editors', wikiNs.id));
wikiNs.addRoom(new Room(2, 'Others', wikiNs.id));

mozillaNs.addRoom(new Room(0, 'Firefox', mozillaNs.id));
mozillaNs.addRoom(new Room(1, 'SeaMonkey', mozillaNs.id));
mozillaNs.addRoom(new Room(2, 'SpiderMonkey', mozillaNs.id));
mozillaNs.addRoom(new Room(3, 'Rust', mozillaNs.id));

linuxNs.addRoom(new Room(0, 'Ubuntu', linuxNs.id));
linuxNs.addRoom(new Room(1, 'Fedora', linuxNs.id));
linuxNs.addRoom(new Room(2, 'Arch', linuxNs.id));
linuxNs.addRoom(new Room(3, 'Others', linuxNs.id));

const namespaces = [wikiNs, mozillaNs, linuxNs];

export default namespaces;
