import prisma from '../prisma/db.js';

export async function getAllBlogs(req, res) {
  const { category, search, page = 1, limit = 9 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  try {
    const where = {};
    if (category && category !== 'All') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { subtitle: { contains: search } },
      ];
    }

    const [total, items] = await prisma.$transaction([
      prisma.blog.count({ where }),
      prisma.blog.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: Number(limit),
      }),
    ]);

    return res.json({
      items,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return res.status(500).json({ error: 'Failed to fetch blogs.' });
  }
}

export async function getBlogBySlug(req, res) {
  const { slug } = req.params;
  try {
    const blog = await prisma.blog.findUnique({ where: { slug } });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }
    return res.json(blog);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch blog post.' });
  }
}

export async function createBlog(req, res) {
  const { title, subtitle, content, imageUrl, category, tags, author, readTime } = req.body;
  if (!title || !content || !category || !author) {
    return res.status(400).json({ error: 'Title, content, category and author are required.' });
  }

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  try {
    const existing = await prisma.blog.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const newBlog = await prisma.blog.create({
      data: {
        title,
        slug: finalSlug,
        subtitle,
        content,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800',
        category,
        tags: tags || '',
        author,
        readTime: readTime || '5 min read',
      },
    });

    return res.status(201).json(newBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    return res.status(500).json({ error: 'Failed to create blog.' });
  }
}

export async function updateBlog(req, res) {
  const { id } = req.params;
  const { title, subtitle, content, imageUrl, category, tags, author, readTime, isPublished } = req.body;

  try {
    const existingBlog = await prisma.blog.findUnique({ where: { id } });
    if (!existingBlog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    const data = {
      title,
      subtitle,
      content,
      imageUrl,
      category,
      tags,
      author,
      readTime,
      isPublished,
    };

    if (title && title !== existingBlog.title) {
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const existingSlug = await prisma.blog.findUnique({ where: { slug } });
      data.slug = existingSlug ? `${slug}-${Date.now()}` : slug;
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data,
    });

    return res.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return res.status(500).json({ error: 'Failed to update blog.' });
  }
}

export async function deleteBlog(req, res) {
  const { id } = req.params;
  try {
    await prisma.blog.delete({ where: { id } });
    return res.json({ success: true, message: 'Blog post deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete blog.' });
  }
}
