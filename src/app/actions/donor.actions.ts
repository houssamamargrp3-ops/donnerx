"use server";

import { prisma } from "@/lib/prisma";
import { donorSchema, DonorFormData } from "@/lib/validations/donor";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import crypto from "crypto";

export async function createDonor(data: DonorFormData) {
  try {
    const validatedData = donorSchema.parse(data);

    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { error: "البريد الإلكتروني مسجل مسبقاً." };
    }

    // Generate random password for the user
    const randomPassword = crypto.randomBytes(8).toString("hex");
    const hashedPassword = await hash(randomPassword, 12);

    // Create User and Donor in a transaction
    const newDonor = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          password: hashedPassword,
          role: "DONOR",
        },
      });

      const donor = await tx.donor.create({
        data: {
          userId: user.id,
          phone: validatedData.phone,
          bloodType: validatedData.bloodType,
          gender: validatedData.gender,
          dateOfBirth: new Date(validatedData.dateOfBirth),
          weight: validatedData.weight,
          address: validatedData.address,
          city: validatedData.city,
          chronicDiseases: validatedData.chronicDiseases
            ? validatedData.chronicDiseases.split(",").map((d) => d.trim()).filter(Boolean)
            : [],
          eligibilityStatus: validatedData.eligibilityStatus,
          eligibilityReason: validatedData.eligibilityReason,
        },
      });

      return donor;
    });

    revalidatePath("/dashboard/donors");
    return { success: true, donorId: newDonor.id };
  } catch (error: any) {
    console.error("Error creating donor:", error);
    return { error: error.message || "حدث خطأ أثناء إنشاء المتبرع." };
  }
}

export async function updateDonor(donorId: string, data: DonorFormData) {
  try {
    const validatedData = donorSchema.parse(data);

    // We must find the donor to get the userId so we can update the User's name/email if needed
    const existingDonor = await prisma.donor.findUnique({
      where: { id: donorId },
      include: { user: true },
    });

    if (!existingDonor) {
      return { error: "المتبرع غير موجود." };
    }

    // Check if email changed and if the new email is already taken
    if (existingDonor.user.email !== validatedData.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });
      if (emailTaken) {
        return { error: "البريد الإلكتروني الجديد مسجل لمستخدم آخر." };
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: existingDonor.userId },
        data: {
          name: validatedData.name,
          email: validatedData.email,
        },
      });

      await tx.donor.update({
        where: { id: donorId },
        data: {
          phone: validatedData.phone,
          bloodType: validatedData.bloodType,
          gender: validatedData.gender,
          dateOfBirth: new Date(validatedData.dateOfBirth),
          weight: validatedData.weight,
          address: validatedData.address,
          city: validatedData.city,
          chronicDiseases: validatedData.chronicDiseases
            ? validatedData.chronicDiseases.split(",").map((d) => d.trim()).filter(Boolean)
            : [],
          eligibilityStatus: validatedData.eligibilityStatus,
          eligibilityReason: validatedData.eligibilityReason,
        },
      });
    });

    revalidatePath("/dashboard/donors");
    revalidatePath(`/dashboard/donors/${donorId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating donor:", error);
    return { error: error.message || "حدث خطأ أثناء تحديث بيانات المتبرع." };
  }
}

export async function deleteDonor(donorId: string) {
  try {
    const existingDonor = await prisma.donor.findUnique({
      where: { id: donorId },
    });

    if (!existingDonor) {
      return { error: "المتبرع غير موجود." };
    }

    // Because of Cascade delete, deleting the User deletes the Donor
    await prisma.user.delete({
      where: { id: existingDonor.userId },
    });

    revalidatePath("/dashboard/donors");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting donor:", error);
    return { error: "حدث خطأ أثناء حذف المتبرع." };
  }
}
