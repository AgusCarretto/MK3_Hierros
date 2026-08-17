export const API_BASE_URL = "https://mk3hierros-production.up.railway.app";

async function fetchJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${path}`);
  }
  return response.json();
}

export function workImageUrl(workId, imageId) {
  return `${API_BASE_URL}/trabajo/${workId}/images/${imageId}`;
}

export function getCategories() {
  return fetchJson("/categorias");
}

export async function getFinishedWorks(categoryId) {
  const path = categoryId
    ? `/trabajo/getByCategoryFinished/${categoryId}`
    : "/trabajo/byStatus/Finalizado";
  const data = await fetchJson(path);
  return data.filter((work) => work.status === "Finalizado");
}

const toSafeImage = (image) =>
  image && image.id
    ? {
        id: image.id,
        imageName: image.imageName ?? null,
        imageMimeType: image.imageMimeType ?? null,
      }
    : null;

export async function getWorkDetail(id) {
  const [work, images] = await Promise.all([
    fetchJson(`/trabajo/${id}`),
    fetchJson(`/trabajo/${id}/images`),
  ]);

  const safeImages = Array.isArray(images)
    ? images.map(toSafeImage).filter(Boolean)
    : [];

  const safeWork = {
    ...work,
    images: Array.isArray(work?.images)
      ? work.images.map(toSafeImage).filter(Boolean)
      : undefined,
  };

  return { work: safeWork, images: safeImages };
}
