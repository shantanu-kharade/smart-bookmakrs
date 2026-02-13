'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addBookmark(formData: FormData) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error('User is not authenticated');
    }

    const title = formData.get('title') as string;
    const url = formData.get('url') as string;

    if (!title || !url) {
        return
    }

    const { error } = await supabase.from('bookmarks').insert({
        title,
        url,
        user_id: user.id
    })

    if (error) {
        throw new Error('Failed to add bookmark');
    }

    revalidatePath('/')
}

export async function deleteBookmark(formData: FormData) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error('User is not authenticated');
    }

    const id = formData.get('id') as string;

    if (!id) {
        throw new Error('Bookmark ID is required');
    }

    const { error } = await supabase.from('bookmarks').delete().match({ id, user_id: user.id });

    if (error) {
        throw new Error('Failed to delete bookmark')
    }

    revalidatePath('/')
}

export async function updateBookmark(formData: FormData) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error('User is not authenticated');
    }

    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const url = formData.get('url') as string;

    if (!id || !title || !url) {
        return;
    }

    const { error } = await supabase
        .from('bookmarks')
        .update({
            title,
            url
        })
        .eq('id', id);

    if (error) {
        throw new Error('Failed to update bookmark');
    }

    revalidatePath('/');
}