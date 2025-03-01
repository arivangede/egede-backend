const { prisma } = require('../../../../utilities/database')
const { ResponseError } = require("../../../../utilities/response")
const { customAlphabet } = require("nanoid")
const fs = require("fs")

const get = async (req, res, next) => {
    try {
        let data = []

        data = await prisma.badanPermusyawaratanDesa.findMany()
        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const getById = async (req, res, next) => {
    try {
        const { id } = req.params

        const data = await prisma.badanPermusyawaratanDesa.findFirst({
            where: {
                id: id
            }
        })

        if (!data) {
            return res.status(404).json({
                message: "Data not found",
            });
        }

        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error);
        next(new ResponseError(500, "Internal server error"));
    }
}

const getAnggotaById = async (req, res, next) => {
    try {
        const { gid, anggotaId } = req.params

        const anggota = await prisma.badanPermusyawaratanDesa.findFirst({
            where: {
                id: gid
            },
            select: {
                data_anggota: true
            }
        })

        if (!anggota) {
            return res.status(400).json({ message: "Anggota is not found" })
        }

        const filtered = anggota.data_anggota.filter((item) => item.id == anggotaId)

        res.status(200).json({ message: "Successfully.", data: filtered })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const create = async (req, res, next) => {
    try {
        const { gid } = req.user
        const { filename, path } = req.file

        const badanPermusyawaratan = await prisma.badanPermusyawaratanDesa.findFirst({
            where: {
                id: gid
            }
        })

        if (badanPermusyawaratan) {
            return res.status(400).json({
                message: "Badan Permusyawaratan Desa is already exists"
            })
        }

        const fileData = {
            filename: filename,
            path: path
        }

        fileData.path = fileData.path.replace(/\\/g, '/')

        await prisma.badanPermusyawaratanDesa.create({
            data: {
                id: gid,
                img: fileData
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error('ERROR =>', error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const update = async (req, res, next) => {
    try {
        const { id } = req.params
        const badanPermusyawaratan = await prisma.badanPermusyawaratanDesa.findFirst({
            where: {
                id: id
            }
        })

        if (!badanPermusyawaratan) {
            return res.status(400).json({ message: "Badan Permusyawaratan Desa is not found" })
        }

        const updated = {}

        if (req.file) {
            if (badanPermusyawaratan.img) {
                fs.unlinkSync(badanPermusyawaratan.img.path)
            }

            const { filename, path } = req.file
            const filepath = path.replace(/\\/g, "/")
            updated.img = { filename: filename, path: filepath }
        }

        await prisma.badanPermusyawaratanDesa.update({
            where: {
                id: id
            },
            data: updated
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error('ERROR ->', error)
        next(new ResponseError(500, "Internal Server Error"))
    }
}

const createAnggota = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nama_lengkap, jabatan, email, telp } = req.body;
        const nanoIdCustom = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 3);
        const { filename, path } = req.file

        const badanPermusyawaratan = await prisma.badanPermusyawaratanDesa.findFirst({
            where: {
                id: id
            }
        });

        if (!badanPermusyawaratan) {
            return res.status(400).json({ message: "Badan Permusyawaratan Desa not found" });
        }

        const fileData = {
            filename: filename,
            path: path
        };

        fileData.path = fileData.path.replace(/\\/g, '/');

        const newDataAnggota = {
            id: nanoIdCustom(),
            nama_lengkap: nama_lengkap,
            jabatan: jabatan,
            email: email,
            telp: telp,
            img: fileData
        };

        await prisma.badanPermusyawaratanDesa.update({
            where: {
                id: id
            },
            data: {
                data_anggota: {
                    push: newDataAnggota
                }
            }
        });

        res.status(200).json({ message: "Successfully." });
    } catch (error) {
        console.error('ERROR =>', error);
        next(new ResponseError(500, "Internal server error"));
    }
}

const updateAnggota = async (req, res, next) => {
    try {
        const { gid, anggotaId } = req.params
        const { nama_lengkap, jabatan, email, telp } = req.body

        const badanPermusyawaratan = await prisma.badanPermusyawaratanDesa.findFirst({
            where: {
                id: gid
            }
        })

        if (!badanPermusyawaratan) {
            return res.status(400).json({ message: "Badan Permusyawaratan Desa is not found" })
        }

        const updatedAnggota = badanPermusyawaratan.data_anggota.find(anggota => anggota.id === anggotaId)

        if (!updatedAnggota) {
            return res.status(400).json({ message: "Anggota is not found" })
        }

        updatedAnggota.nama_lengkap = nama_lengkap
        updatedAnggota.jabatan = jabatan
        updatedAnggota.email = email
        updatedAnggota.telp = telp

        if (req.file) {
            const { filename, path } = req.file
            if (updateAnggota.img) {
                fs.unlinkSync(updatedAnggota.img.path);
            }
            updatedAnggota.img = { filename, path: path.replace(/\\/g, '/') }
        }

        await prisma.badanPermusyawaratanDesa.update({
            where: {
                id: gid
            },
            data: {
                data_anggota: {
                    set: badanPermusyawaratan.data_anggota
                }
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const remove = async (req, res, next) => {
    try {
        const { id } = req.params

        const badanPermusyawaratan = await prisma.badanPermusyawaratanDesa.findFirst({
            where: {
                id: id
            }
        })

        if (!badanPermusyawaratan) {
            res.status(400).json({ message: "Badan Permusyawaratan Desa not found" })
        }

        if (badanPermusyawaratan.img) {
            fs.unlinkSync(badanPermusyawaratan.img.path)
        }

        await prisma.badanPermusyawaratanDesa.delete({
            where: {
                id: id
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const removeAnggota = async (req, res, next) => {
    try {
        const { gid, anggotaId } = req.params

        const badanPermusyawaratan = await prisma.badanPermusyawaratanDesa.findFirst({
            where: {
                id: gid
            }
        })

        if (!badanPermusyawaratan) {
            res.status(400).json({ message: "Badan Permusyawaratan Desa is not found" })
        }

        const index = badanPermusyawaratan.data_anggota.findIndex(anggota => anggota.id === anggotaId)

        if (index === -1) {
            return res.status(400).json({ message: "Anggota is not found" });
        }

        const removeAnggota = badanPermusyawaratan.data_anggota[index]

        if (removeAnggota.img) {
            fs.unlinkSync(removeAnggota.img.path)
        }

        const updatedDataAnggota = [...badanPermusyawaratan.data_anggota.slice(0, index), ...badanPermusyawaratan.data_anggota.slice(index + 1)]

        await prisma.badanPermusyawaratanDesa.update({
            where: {
                id: gid
            },
            data: {
                data_anggota: {
                    set: updatedDataAnggota
                }
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

module.exports = {
    get,
    getById,
    getAnggotaById,
    create,
    update,
    createAnggota,
    updateAnggota,
    remove,
    removeAnggota
}