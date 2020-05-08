import {StyleSheet} from 'react-native';
import {Fonts} from '../../Themes/';
import Colors from '../../Themes/Colors';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    textAlign: 'center',
    paddingVertical: 3,
    fontWeight: 'bold',
    fontSize: Fonts.size.tiny,
  },
  iconStyle: {
    width: 30,
    height: 30,
    paddingVertical: 5,
    resizeMode: 'contain',
  },
  iconTopper: {
    position: 'absolute',
    top: 7,
  },
  notificationBadgeCountStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: 'white',
    fontSize: 10,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    paddingHorizontal: 2,
    height: 15,
    minWidth: 18,
    position: 'absolute',
    top: 0,
    right: 10,
    backgroundColor: Colors.fire,
  },
});
