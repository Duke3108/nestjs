export class Helper {
  static makeSlugFromString = (text: string): string => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f,"]/g, '')
      .toLowerCase()
      .trim()
      .replace('đ', 'd')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
  };

  static generateDefaultAvatar = (username: string) => {
    return `https://ui-avatars.com/api/?name=${username}&background=random&rounded=true&bold=true`;
  };
}
export default Helper;
