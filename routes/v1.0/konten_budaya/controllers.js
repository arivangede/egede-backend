const { prisma } = require("../../../utilities/database")
const { ResponseError } = require("../../../utilities/response")
const fs = require("fs")

const kontenBudaya = async (req, res, next) => {
    try {
        const result = await prisma.kontenBudaya.findMany()

        res.status(200).json({ message: "Successfully.", data: result })
    } catch (error) {
        console.error("ERROR =>", error);
        next(new ResponseError(500, "Internal server error"));
    }
}

const kontenBudayaById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const data = await prisma.kontenBudaya.findFirst({
            where: {
                id: id
            }
        })

        if (!data) {
            return res.status(404).json({ message: "Konten Budaya is not found" })
        }

        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const kontenBudayaByGate = async (req, res, next) => {
    try {
        const { gid } = req.user

        const data = await prisma.kontenBudaya.findMany({
            where: {
                fk_gate_id: gid
            },
            include: {
                kategori_budaya: {
                    select: {
                        nama_kategori: true
                    }
                }
            }
        });

        const formattedData = data.map(item => ({
            id: item.id,
            fk_kategori_budaya_id: item.fk_kategori_budaya_id,
            nama: item.nama,
            alamat: item.alamat,
            link_gmaps: item.link_gmaps,
            deskripsi: item.deskripsi,
            img: item.img,
            fk_gate_id: item.fk_gate_id,
            cts: item.cts,
            uts: item.uts,
            kategori: item.kategori_budaya.nama_kategori
        }));

        res.status(200).json({ message: "Successfully.", data: formattedData })
    } catch (error) {
        console.error("ERROR =>", error);
        next(new ResponseError(500, "Internal server error"));
    }
}

const kontenBudayaByDesa = async (req, res, next) => {
    try {
        const { desa, search } = req.query
        let { limit, offset } = req.query
        limit = parseInt(limit)
        offset = parseInt(offset)

        if (!limit) {
            limit = 20
        }

        if (!offset) {
            offset = 0
        }

        const dataDesa = await prisma.daerah.findFirst({
            where: {
                desa: desa
            },
            select: {
                fk_gate_id: true,
            }
        })

        if (!dataDesa) {
            return res.status(404).json({ message: "Daerah is not found" })
        }

        const result = await prisma.kontenBudaya.findMany({
            where: {
                fk_gate_id: dataDesa.fk_gate_id,
                nama: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            take: limit,
            skip: offset
        })
        res.status(200).json({ message: "Successfully.", data: result })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const filter = async (req, res, next) => {
    try {
        const { search, kategori_id } = req.params
        let { limit, offset } = req.query
        limit = parseInt(limit) || 20
        offset = parseInt(offset) || 0

        const filters = {}

        if (search) {
            filters.nama = {
                contains: search,
                mode: "insensitive"
            }
        }

        if (kategori_id) {
            filters.fk_kategori_budaya_id = parseInt(kategori_id)
        }

        const result = await prisma.kontenBudaya.findMany({
            where: filters,
            take: limit,
            skip: offset,
            include: {
                kategori_budaya: {
                    select: {
                        nama_kategori: true
                    }
                }
            }
        })

        const formattedData = result.map(item => ({
            id: item.id,
            fk_kategori_budaya_id: item.fk_kategori_budaya_id,
            nama: item.nama,
            alamat: item.alamat,
            link_gmaps: item.link_gmaps,
            deskripsi: item.deskripsi,
            img: item.img,
            fk_gate_id: item.fk_gate_id,
            cts: item.cts,
            uts: item.uts,
            kategori: item.kategori_budaya.nama_kategori
        }))

        res.status(200).json({ message: "Successfully.", data: formattedData })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const tambahKontenBudaya = async (req, res, next) => {
    try {
        const { gid } = req.user
        const { fk_kategori_budaya_id, nama, alamat, link_gmaps, deskripsi } = req.body
        const img = req.files
        const fileData = []

        const existsName = await prisma.kontenBudaya.findFirst({
            where: {
                nama: nama
            }
        })

        if (existsName) {
            return res.status(400).json({ message: "Konten Budaya is already exists" })
        }

        const existsCategory = await prisma.kategoriBudaya.findUnique({
            where: {
                id: parseInt(fk_kategori_budaya_id)
            }
        })

        if (!existsCategory) {
            return res.status(404).json({ message: "Kategori Budaya is not found" })
        }

        if (img) {
            img.forEach((file) => {
                const { filename, path } = file
                const fileObj = { filename: filename, path: path.replace(/\\/g, '/') }
                fileData.push(fileObj)
            })
        }

        await prisma.kontenBudaya.create({
            data: {
                fk_kategori_budaya_id: parseInt(fk_kategori_budaya_id),
                nama: nama,
                alamat: alamat,
                deskripsi: deskripsi,
                link_gmaps: link_gmaps,
                img: fileData,
                fk_gate_id: gid
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const ubahKontenBudaya = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const { fk_kategori_budaya_id, nama, alamat, link_gmaps, deskripsi } = req.body
        const img = req.files
        const fileData = []

        const data = await prisma.kontenBudaya.findFirst({
            where: {
                id: id
            }
        })

        if (!data) {
            return res.status(404).json({ message: "Konten Budaya is not found" })
        }

        if (data.img && img) {
            data.img.forEach((file) => {
                fs.unlinkSync(file.path.replace(/\\/g, '/'))
            })
        }

        if (img) {
            img.forEach((file) => {
                const { filename, path } = file
                const fileObj = { filename: filename, path: path.replace(/\\/g, '/') }
                fileData.push(fileObj)
            });
        }

        await prisma.kontenBudaya.update({
            where: {
                id: id
            },
            data: {
                fk_kategori_budaya_id: parseInt(fk_kategori_budaya_id),
                nama: nama,
                alamat: alamat,
                link_gmaps: link_gmaps,
                deskripsi: deskripsi,
                img: fileData
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const hapusKontenBudaya = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const data = await prisma.kontenBudaya.findFirst({
            where: {
                id: id
            }
        })

        if (!data) {
            return res.status(404).json({ message: "Konten Budaya is not found" })
        }


        if (data.img) {
            data.img.forEach((file) => {
                fs.unlinkSync(file.path)
            })
        }

        await prisma.kontenBudaya.delete({
            where: {
                id: id
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("Error =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

module.exports = {
    kontenBudaya,
    kontenBudayaById,
    kontenBudayaByGate,
    kontenBudayaByDesa,
    filter,
    tambahKontenBudaya,
    ubahKontenBudaya,
    hapusKontenBudaya
}