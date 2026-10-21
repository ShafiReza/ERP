using ScopoERP.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace ScopoERP.Domain.Repositories
{
    public class Repository<TEntity> : IRepository<TEntity>
        where TEntity : class
    {
        internal ScopoContext db;
        internal DbSet<TEntity> dbSet;

        public Repository(ScopoContext db)
        {
            this.db = db;
            this.dbSet = db.Set<TEntity>();
        }

        public virtual IQueryable<TEntity> Get(string includeProperties = "")
        {
            IQueryable<TEntity> query = dbSet;
            foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }
            return query;
        }

        public virtual TEntity GetById(object id)
        {
            return dbSet.Find(id);
        }

        public virtual void Insert(TEntity entity)
        {
            dbSet.Add(entity);
        }

        public virtual void InsertRange(IEnumerable<TEntity> entity)
        {
            dbSet.AddRange(entity);
        }

        public virtual void Update(TEntity entity)
        {
            dbSet.Attach(entity);
            db.Entry(entity).State = EntityState.Modified;
        }

        public virtual void Delete(TEntity entity)
        {
            dbSet.Attach(entity);
            db.Entry(entity).State = EntityState.Deleted;
        }

        public virtual void DeleteRange(IEnumerable<TEntity> entity)
        {
            dbSet.RemoveRange(entity);
        }

        public virtual void RawQuery(string query)
        {
            db.Database.ExecuteSqlCommand(query);
        }

        public virtual List<T> SelectQuery<T>(string query)
        {
            return db.Database.SqlQuery<T>(query).ToList();
        }
    }
}
