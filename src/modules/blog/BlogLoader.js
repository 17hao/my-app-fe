const importAll = r => r.keys().map(r);
const markdownFiles = importAll(require.context("modules/blog/markdown", false, /\.\/.*\.md$/));
const promises = markdownFiles.map(async (f) => {
    return {
        path: f.split("/")[3].split(".")[0], // e.g. ./calculus.md => calculus
        text: await fetch(f).then(res => res.text())
    };
});
const blogs = await Promise.all(promises).catch(err => console.error(err));

export const blogTitles = () => {
    return blogs.map((b) => b.path);
};

export function loadBlog(path) {
    for (var i = 0; i < blogs.length; i++) {
        if (blogs[i].path === path) {
            return blogs[i].text;
        }
    }
};
