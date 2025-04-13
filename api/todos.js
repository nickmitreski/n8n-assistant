import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { title } = req.body;
      const { data, error } = await supabase
        .from('todos')
        .insert([{ title, completed: false }])
        .select();

      if (error) throw error;
      res.status(201).json({ data: data[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { id, completed } = req.body;
      const { data, error } = await supabase
        .from('todos')
        .update({ completed })
        .eq('id', id)
        .select();

      if (error) throw error;
      res.status(200).json({ data: data[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 