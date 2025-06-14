"use server";
import { createClient } from "@/utils/supabase/server";

export async function elevateUserToAdmin(email: string) {
  const supabase = await createClient();
  
  const userList = await supabase.auth.admin.listUsers();
  const user = userList.data.users.find((user) => user.email === email);

  if (!user) {
    throw new Error("User not found");
  }

  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    user_metadata: {
      ...user.user_metadata,
      role: "Admin"
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return;
}

export async function getAllEmails(): Promise<string[]> {
  const supabase = await createClient();
  const userList = await supabase.auth.admin.listUsers();
  return userList!.data!.users!.map((user) => user.email!);
}