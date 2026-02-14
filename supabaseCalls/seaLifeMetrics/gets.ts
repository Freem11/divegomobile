import { Animal } from "../../entities/photos";
import { SeaLife } from "../../entities/seaLIfe";
import { supabase } from "../../supabase";
import { Image } from "../../entities/image";

export const getSpeciesData = async(species: string) => {
  const { data, error } = await supabase
    .from("species")
    .select()
    .eq("name", species);

  if (error) {
    console.log("couldn't do it GET_SPECIES_DATA,", error);
    return null;
  }

  if (data) {
    return data[0] as SeaLife;
  }
};

export const getSpeciesPhotos = async(species: string): Promise<Animal[]> => {
  const { data, error } = await supabase.rpc("get_species_photos_with_variants", {
    p_species: species
  });

  if (error) {
    console.log("couldn't do it GET_SPECIES_PHOTOS,", error);
    return [];
  }

  const result = [] as Animal[];
  if (data) {
    data.forEach((item: any) => {
      const animal: Animal = {
        label: item.label,
        times_seen: item.times_seen,
        image: {
          file_name: item.photofile,
          public_domain: item.public_domain,
          sm: item.sm,
          md: item.md,
          lg: item.lg,
          xl: item.xl,
        },
      };

      result.push(animal);
    });

  }
  return result;
};

export const getSpeciesSiteCount = async(species: string, limit?: number) => {
  let query = supabase
    .from("speciesSiteCount")
    .select(`
            *,
            original_site_id:site_id, 
            site_id:diveSites (
                name,
                diveSiteProfilePhoto,
                image_id,
                images (
                    public_domain,
                    sm,
                    md,
                    lg,
                    xl
                )
            )
        `)
    .eq("label", species)
    .order("photo_count", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.log("Error fetching species site count:", error);
    return [];
  }

  return data.map(item => {
    const site = item.site_id;
    const img = site?.images;

    return {
      ...item,
      id: item.original_site_id,
      siteName: site?.name,
      sitePhoto: site?.diveSiteProfilePhoto,
      imageVariants: img?.public_domain ? {
        file_name: site?.diveSiteProfilePhoto,
        public_domain: img.public_domain,
        sm: `${img.sm}`,
        md: `${img.md}`,
        lg: `${img.lg}`,
        xl: `${img.xl}`
      } : null
    };
  });
};

export const getSpeciesUserCount = async(species: string, limit?: number) => {
  let query = supabase
    .from("speciesUserCount")
    .select(`
            *,
            user_id:UserProfiles (
                id,           
                UserName,
                profilePhoto,
                image_id,
                images (
                    public_domain,
                    sm,
                    md,
                    lg,
                    xl
                )
            )
        `)
    .eq("label", species)
    .order("photo_count", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.log("Error in getSpeciesUserCount:", error);
    return [];
  }

  return data.map(item => {
    const user = item.user_id;
    const img = user?.images;

    return {
      ...item,
      id: user?.id,
      userName: user?.UserName,
      profilePhoto: user?.profilePhoto,
      imageVariants: img?.public_domain ? {
        file_name: user?.profilePhoto,
        public_domain: img.public_domain,
        sm: `${img.sm}`,
        md: `${img.md}`,
        lg: `${img.lg}`,
        xl: `${img.xl}`
      } : null
    };
  });
};

export const getSingleSpecies = async(species: string) => {
  const { data, error } = await supabase.rpc("get_single_species_with_images", {
    p_species: species
  });

  if (error) {
    console.log("couldn't do it GET_SINGLE_SPECIES,", error);
    return [];
  }

  const animal: Image = {
    file_name: data[0].photofile,
    public_domain: data[0].public_domain,
    sm: data[0].sm,
    md: data[0].md,
    lg: data[0].lg,
    xl: data[0].xl,
  };

  return {
    ...data[0],
    speciesPhoto: animal,
  };

};