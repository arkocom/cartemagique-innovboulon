import { isShareAbortError } from './shareUtils';

export function createVideoFile(blob: Blob): File {
  // Android file sharing expects the container MIME, without codec parameters.
  const type = blob.type.split(';')[0].trim().toLowerCase();
  if (!blob.size || !['video/mp4', 'video/webm'].includes(type)) {
    throw new Error('La vidéo est vide ou son format est inconnu. Créez-la de nouveau.');
  }
  return new File([blob], `carte-magique.${type === 'video/mp4' ? 'mp4' : 'webm'}`, { type });
}

type FileShareNavigator = Pick<Navigator, 'share' | 'canShare'>;
export async function shareVideoFile(blob: Blob, target: FileShareNavigator = navigator): Promise<'shared' | 'cancelled' | 'unsupported'> {
  const file = createVideoFile(blob);
  if (typeof target.share !== 'function' || (typeof target.canShare === 'function' && !target.canShare({ files: [file] }))) return 'unsupported';
  try {
    // Do not await generation or fetch here: sharing must retain the button's user activation.
    await target.share({ files: [file] });
    return 'shared';
  } catch (error) {
    if (isShareAbortError(error)) return 'cancelled';
    throw error;
  }
}
