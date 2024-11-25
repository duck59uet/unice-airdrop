import {
  ValidationOptions,
  registerDecorator,
  buildMessage,
} from 'class-validator';

// https://github.com/arthurvr/image-extensions/blob/master/image-extensions.json
const IMAGE_EXTENSIONS = new Set([
  'ase',
  'art',
  'bmp',
  'blp',
  'cd5',
  'cit',
  'cpt',
  'cr2',
  'cut',
  'dds',
  'dib',
  'djvu',
  'egt',
  'exif',
  'gif',
  'gpl',
  'grf',
  'icns',
  'ico',
  'iff',
  'jng',
  'jpeg',
  'jpg',
  'jfif',
  'jp2',
  'jps',
  'lbm',
  'max',
  'miff',
  'mng',
  'msp',
  'nef',
  'nitf',
  'ota',
  'pbm',
  'pc1',
  'pc2',
  'pc3',
  'pcf',
  'pcx',
  'pdn',
  'pgm',
  'PI1',
  'PI2',
  'PI3',
  'pict',
  'pct',
  'pnm',
  'pns',
  'ppm',
  'psb',
  'psd',
  'pdd',
  'psp',
  'px',
  'pxm',
  'pxr',
  'qfx',
  'raw',
  'rle',
  'sct',
  'sgi',
  'rgb',
  'int',
  'bw',
  'tga',
  'tiff',
  'tif',
  'vtf',
  'xbm',
  'xcf',
  'xpm',
  '3dv',
  'amf',
  'ai',
  'awg',
  'cgm',
  'cdr',
  'cmx',
  'dxf',
  'e2d',
  'egt',
  'eps',
  'fs',
  'gbr',
  'odg',
  'svg',
  'stl',
  'vrml',
  'x3d',
  'sxd',
  'v2d',
  'vnd',
  'wmf',
  'emf',
  'art',
  'xar',
  'png',
  'webp',
  'jxr',
  'hdp',
  'wdp',
  'cur',
  'ecw',
  'iff',
  'lbm',
  'liff',
  'nrrd',
  'pam',
  'pcx',
  'pgf',
  'sgi',
  'rgb',
  'rgba',
  'bw',
  'int',
  'inta',
  'sid',
  'ras',
  'sun',
  'tga',
  'heic',
  'heif',
]);

// https://stackoverflow.com/a/680982/10265299
const FILE_EXTESION_EXTRACT_REG = /(?:\.([^.]+))?$/;

// https://github.com/sindresorhus/filename-reserved-regex/blob/main/index.js
const filenameReservedRegex = /[<>:"/\\|?*\u0000-\u001F]/g;
const windowsReservedNameRegex = /^(con|prn|aux|nul|com\d|lpt\d)$/i;
const FILENAME_MAX_LENGTH = 255;

// https://github.com/sindresorhus/valid-filename/blob/main/index.js
function _isValidFileName(string: string) {
  if (!string || string.length > FILENAME_MAX_LENGTH) {
    return false;
  }

  if (
    filenameReservedRegex.test(string) ||
    windowsReservedNameRegex.test(string)
  ) {
    return false;
  }

  if (string === '.' || string === '..') {
    return false;
  }

  return true;
}

export function IsImageFilename(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFilename',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any) =>
          typeof value === 'string' &&
          _isValidFileName(value) &&
          IMAGE_EXTENSIONS.has(FILE_EXTESION_EXTRACT_REG.exec(value)[1]),
        defaultMessage: buildMessage(
          (eachPrefix, { value }) =>
            eachPrefix + `$property must be a image file name not: ${value}`,
          validationOptions,
        ),
      },
    });
  };
}

export function checkIsImageFilename(value: string) {
  return typeof value === 'string' &&
    _isValidFileName(value) &&
    IMAGE_EXTENSIONS.has(FILE_EXTESION_EXTRACT_REG.exec(value)[1])
}
